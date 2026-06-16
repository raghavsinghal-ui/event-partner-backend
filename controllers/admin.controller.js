const crypto = require("crypto");
const Invite = require("../models/inviteToken.models");
const userModel = require("../models/user.models");
exports.invite=async(req,res)=>{
try{

const token = crypto.randomBytes(32).toString("hex");


const invite = await Invite.create({

    token: token,

    role: "admin",

    createdBy: req.user.id,

    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)

});
 const inviteLink = `http://localhost:3000/api/auth/signup/?token=${token}`;
        return res.status(201).json({

            success: true,

            message: "Invite link generated successfully",
            

            inviteLink

        });



}
catch(error){
    console.error("Error generating invite link:", error);
    res.status(500).json({
        success: false,
        message: "Server error while generating invite link"
    });



}

}
exports.demoteUser = async (req, res) => {
  try {
    const { email } = req.body;

  
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }


    if (user.role === "normal") {
      return res.status(400).json({
        success: false,
        message: "User is already a normal user"
      });
    }

    
    user.role = "normal";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Admin demoted successfully",
      user
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};