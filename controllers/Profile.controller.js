const userModel=require("../models/user.models");
const { z } = require("zod");
exports.getProfile=async(req,res)=>{
try{
    const userId=req.user.id;
    const user=await userModel.findById(userId);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    const field={
name:user.name,
email:user.email,
contactNo:user.contactNo,
academic:user.academic,
address:user.address
    }
    res.status(200).json({message:"Profile info retrieved",field})


}
catch(err){
    res.status(500).json({message:"Server error",error:err.message})
}       } ;

exports.verifyUser=async(req,res)=>{
    try{   
        const userId=req.params.userId;
        const user=await userModel.findById(userId);    
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
       
        user.academicVerification.status="verified";
        await user.save();
        res.status(200).json({message:"User verified successfully"});
    }
    catch(err){
        res.status(500).json({message:"Server error",error:err.message})
    }
};
exports.needTovalidate = async (req, res) => {
  try {
    const pendingUsers = await userModel.find({
      "academicVerification.status": "pending",
      isProfileComplete: true
    });

    res.status(200).json({
      users: pendingUsers
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const addressValidationSchema = z.object({
  country: z
    .string()
    .trim()
    .min(2, "Country is required"),

  state: z
    .string()
    .trim()
    .min(2, "State is required"),

  city: z
    .string()
    .trim()
    .min(2, "City is required"),

  landmark: z
    .string()
    .trim()
    .max(100, "Landmark too long")
    .optional()
});

// ================= ACADEMIC SCHEMA =================

const academicValidationSchema = z.object({
  department: z
    .string()
    .trim()
    .min(2, "Department is required"),

  branch: z
    .string()
    .trim()
    .min(2, "Branch is required"),

  studyInYear: z
    .coerce
    .number()
    .int("Study year must be integer")
    .min(1)
    .max(5),

  cgpa: z
    .coerce
    .number()
    .min(0)
    .max(10)
});

// ================= BASE PROFILE SCHEMA =================

const baseProfileSchema = z.object({

  name: z
    .string()
    .trim()
    .min(2, "Name is required"),

  contactNo: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  academic: academicValidationSchema,

  address: addressValidationSchema

}).strict();

// ================= UPDATE SCHEMA =================

const updateProfileSchema =
  baseProfileSchema.deepPartial();

// ================= COMPLETE PROFILE SCHEMA =================

const completeProfileSchema =
  baseProfileSchema;

// ================= CONTROLLER =================

exports.completeProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    // ================= VALIDATE PATCH DATA =================

    const result =
      updateProfileSchema.safeParse(req.body);

    if (!result.success) {

      return res.status(400).json({
        success: false,
        errors: result.error.flatten()
      });

    }

    // CLEANED DATA
    const data = result.data;

    // ================= CHECK DUPLICATE CONTACT =================

    if (data.contactNo) {

      const existingUser =
        await userModel.findOne({
          contactNo: data.contactNo,
          _id: { $ne: userId }
        });

      if (existingUser) {

        return res.status(400).json({
          success: false,
          message: "Contact number already exists"
        });

      }

    }

    // ================= BUILD SAFE UPDATE OBJECT =================

    const updateData = {};

    // ---------- BASIC FIELDS ----------

    if (data.name !== undefined)
      updateData.name = data.name;

    if (data.contactNo !== undefined)
      updateData.contactNo = data.contactNo;

    // ---------- ACADEMIC ----------

    if (data.academic?.department !== undefined)
      updateData["academic.department"] =
        data.academic.department;

    if (data.academic?.branch !== undefined)
      updateData["academic.branch"] =
        data.academic.branch;

    if (data.academic?.studyInYear !== undefined)
      updateData["academic.studyInYear"] =
        data.academic.studyInYear;

    if (data.academic?.cgpa !== undefined)
      updateData["academic.cgpa"] =
        data.academic.cgpa;

    // ---------- ADDRESS ----------

    if (data.address?.country !== undefined)
      updateData["address.country"] =
        data.address.country;

    if (data.address?.state !== undefined)
      updateData["address.state"] =
        data.address.state;

    if (data.address?.city !== undefined)
      updateData["address.city"] =
        data.address.city;

    if (data.address?.landmark !== undefined)
      updateData["address.landmark"] =
        data.address.landmark;

    // ================= UPDATE USER =================

    await userModel.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    // ================= FETCH UPDATED USER =================

    const updatedUser =
      await userModel.findById(userId);

    if (!updatedUser) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    // ================= CHECK PROFILE COMPLETION =================

   const profileData = {
  name: updatedUser.name,
  contactNo: updatedUser.contactNo,
  academic: updatedUser.academic,
  address: updatedUser.address
};

const isComplete =
  completeProfileSchema
    .safeParse(profileData)
    .success;
    // ================= UPDATE COMPLETION STATUS =================

    updatedUser.isProfileComplete =
      isComplete;
if(isComplete){
  updatedUser.academicVerification.status="pending";
}
    await updatedUser.save();

    // ================= RESPONSE =================

    return res.status(200).json({
      success: true,
      message: isComplete
        ? "Profile completed successfully"
        : "Profile updated successfully",
      isProfileComplete: isComplete,
      user: updatedUser
    });

  }

  catch (err) {

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });

  }

};