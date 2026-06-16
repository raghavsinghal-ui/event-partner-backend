require("dotenv").config();
const transporter=require("./email");


const sendotp=async function(email,otp){

await transporter.sendMail({
from: `"Event Platform" <${process.env.EMAIL_USER}>`,
to:email,
subject:"OTP verification",
html:`<h2>your otp is ${otp}</h2>
<p> Expires in 5 min`



})
}


module.exports=sendotp;