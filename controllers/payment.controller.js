const razorpayInstance = require("../config/razor");
const registrationModel = require("../models/registration.models");
const eventModel = require("../models/event.models");
const paymentModel = require("../models/payment.models");
const crypto = require("crypto");

exports.createOrder = async (req, res) => {
    try {
        const { registrationId } = req.body;
        const userId = req.user.id;

        if (!registrationId) {
            return res.status(400).json({ message: "Registration ID required" });
        }

        
        const registration = await registrationModel.findById(registrationId);

        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }

        if (registration.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

   
        if (registration.expiresAt && registration.expiresAt < new Date()) {
            return res.status(400).json({ message: "Registration expired" });
        }

        if (registration.status === "registered") {
            return res.status(400).json({ message: "Already registered" });
        }

        const event = await eventModel.findById(registration.eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        
        if (!event.paymentRequired || event.price === 0) {
            registration.status = "registered";
            await registration.save();

            return res.status(200).json({
                message: "Free event registered",
                isFree: true
            });
        }

        const existingPayment = await paymentModel.findOne({
            registrationInfo: registrationId,
            transactionStatus: { $in: ["pending", "success"] }
        });

        if (existingPayment) {
            if (existingPayment.transactionStatus === "success") {
                return res.status(400).json({ message: "Already paid" });
            }

            return res.status(200).json({
                orderId: existingPayment.razorpayOrderId,
                amount: existingPayment.amountPaid,
                currency: existingPayment.currency
            });
        }

        
        const amount = event.price * 100;

        const order = await razorpayInstance.orders.create({
            amount,
            currency: "INR",
            receipt: `rcpt_${registrationId.slice(-6)}_${Date.now()}`
        });

        const billSnapshot = {
            eventTitle: event.title,
            eventDate: event.date,
            attendeeName: registration.defaultFields?.name || "",
            attendeeEmail: registration.defaultFields?.email || "",
            amount
        };

      
        await paymentModel.create({
            registrationInfo: registrationId,
            amountPaid: amount,
            currency: "INR",
            paymentProvider: "razorpay",
            razorpayOrderId: order.id,
            transactionStatus: "pending",
            billSnapshot
        });

        return res.status(200).json({
            orderId: order.id,
            amount,
            currency: "INR"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment details" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        
        const payment = await paymentModel.findOne({
            razorpayOrderId: razorpay_order_id
        });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

      
        if (payment.transactionStatus === "success") {
            return res.status(200).json({
                message: "Payment already verified"
            });
        }

        
        const razorpayPayment = await razorpayInstance.payments.fetch(razorpay_payment_id);

        if (razorpayPayment.status !== "captured") {
            payment.transactionStatus = "failed";
            await payment.save();

            return res.status(400).json({ message: "Payment not captured" });
        }

      
        payment.transactionStatus = "success";
        payment.transactionId = razorpay_payment_id;
        payment.transactionDate = new Date();

        await payment.save();

        const registration = await registrationModel.findById(payment.registrationInfo);

        if (registration && registration.status !== "registered") {
            registration.status = "registered";
            await registration.save();
        }

        return res.status(200).json({
            message: "Payment verified successfully"
        });

    } catch (error) {
        console.error("VERIFY ERROR:", error);
        return res.status(500).json({ message: "Verification failed" });
    }
};

