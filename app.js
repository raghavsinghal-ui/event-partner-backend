const express=require("express");

const app=express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
const authRoutes = require("./routes/auth.routes");
const eventRoutes=require("./routes/Event.routes");


const fetchEventRoutes=require("./routes/fetchEvent.routes");

const paymentRoutes=require("./routes/payment.route");

const formRoutes=require("./routes/form.routes");
const adminRoutes=require("./routes/admin.routes");
const profRoutes=require("./routes/prof.routes");




app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/fetch", fetchEventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/form", formRoutes);
app.use("/api/profile", profRoutes);


module.exports=app;