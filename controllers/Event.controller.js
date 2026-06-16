const { generateResponse } = require("../utils/gemini.service");
const eventModel=require('../models/event.models');
const userModel=require('../models/user.models');
const registrationModel= require("../models/registration.models");
const mongoose = require("mongoose");
function buildEventPrompt({
  title,
  description,
  eventDate,
  duration,
  type,
  destination,
  byUser,
  minReq
}) {

  const formattedRequirements = `
- Eligible Year: ${minReq?.year ?? "Open to all years"}
- Department: ${minReq?.department ?? "All departments allowed"}
- Eligible Branches: ${
    minReq?.branches?.length
      ? minReq.branches.join(", ")
      : "All branches allowed"
  }
- Minimum CGPA: ${minReq?.cgpa ?? "No minimum CGPA requirement"}
`;

  return `
You are an elite event marketing strategist and professional copywriter.

Your task is to craft a compelling, high-conversion event post using ONLY the verified information provided below.

==============================
EVENT INFORMATION
==============================

Title: ${title}
Description: ${description}
Event Date: ${eventDate}
Duration: ${duration}
Event Type: ${type}
Location: ${destination}
Organized By: ${byUser}

Participation Requirements:
${formattedRequirements}

==============================
INSTRUCTIONS
==============================

1. Create an engaging opening hook that captures attention immediately.
2. Expand the description into a powerful and vivid event overview.
3. Clearly explain why someone should attend (value, learning, networking, experience, opportunity).
4. Present key highlights in clean bullet points.
5. Clearly outline participation eligibility in a professional way.
6. Maintain a confident, modern, promotional tone.
7. Do NOT invent additional facts beyond the given data.
8. Keep formatting structured and visually clean.
9. End with a strong call-to-action encouraging registration.
10. Word count: 300–450 words.

Output Format:
- Title Header
- Engaging Introduction
- Event Overview Section
- Key Highlights (Bullet Points)
- Eligibility Section
- Closing Call-to-Action

Generate the complete polished event post now.
`;
}
exports.generatePost =async (req, res) =>{
try{
   
const{
title,
description,
 eventDate,
 duration,
 type,
destination,
byUser,
 minReq
}=req.body;
const prompt=buildEventPrompt({
  title,
  description,  
  eventDate,
  duration,
  type,
  destination,
  byUser,
  minReq
});
const result=await generateResponse(prompt);
await eventModel.create({
  title,
  description,
  eventDate,
  duration,
  type,
  destination,
  byUser,
  minReq,
  generatedPost: result
})
res.status(200).json({
  post: result
})
}
catch(error){
    console.error("Error generating event post:", error);
    res.status(500).json({error: error.message});
}



}
 exports.checkReq=async(req,res)=>{
 try{
 const {eventId}=req.params;
 const userId=req.user.id;
 const event=await eventModel.findById(eventId);
 const user=await userModel.findById(userId);
 if(!event){
     return res.status(404).json({message:"Event not found"});
 }  
 
 
 const academic=user.academic;
 const requiredReq=event.minReq;
 if(user.academicVerification.status!=="approved"){
     return res.status(403).json({message:"Academic verification pending or rejected"});
 }
 
 if(requiredReq.department.length>0 && !requiredReq.department.includes(academic.department)){
     return res.status(403).json({message:"Department requirement not met"});
 }
 if(requiredReq.year.length>0 && !requiredReq.year.includes(academic.year)){
     return res.status(403).json({message:"Year requirement not met"});
 }
  
  if(requiredReq.branches.length>0 && !requiredReq.branches.includes(academic.branch)){
     return res.status(403).json({message:"Branch requirement not met"});
 }
 if(requiredReq.cgpa && academic.cgpa<requiredReq.cgpa){
     return res.status(403).json({message:"CGPA requirement not met"});
 
 
 }
 
 
 return res.status(200).json({message:"All requirements met"});
 
 
 
 }
 
 catch(err){
     res.status(500).json({message:"Server error",error:err.message})
 }   
 }
 exports.trackRegistration = async (req, res) => {
     try {
         const { eventId } = req.params;
         const event = await eventModel.findById(eventId);
         if (!event) {
             return res.status(404).json({ message: "Event not found" });
         }
         const registrations = await registrationModel.find({ eventId }).populate("userId", "name email contactNo academic address");
 const registered = registrations.filter(
     r => r.status === "registered"
 );
 
 const pending = registrations.filter(
     r => r.status === "pending"
 );
 res.json({
     registered,
     pending
 });
     
     
     
     }
     catch (err) {
         res.status(500).json({ message: "Server error", error: err.message });
     }
 
 }
exports.getEventDetails = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Event ID is required"
            });
        }

        const event = await eventModel.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: event
        });

    } catch (err) {
        console.error("Get Event Details Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
function EditEventPrompt(changedFields, existingPost) {
    return `
You are given an existing event promotional post.

Your task is to update the post based only on the changed event information.

Do not remove information that is still valid.
Do not invent any information.
Keep the writing style and structure similar to the original post.

Existing Post:
${existingPost}

Updated Fields:
${JSON.stringify(changedFields, null, 2)}

Generate the revised event post only.
`;
}
exports.editEventDetails = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Event ID is required"
            });
        }
 if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });
        }
    


        const event = await eventModel.findById(eventId);
    if (!event) { 
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }
const editableFields = [
    "title",
    "description",
    "eventDate",
    "duration",
    "type",
    "destination",
    "minReq",
    "price",
    "paymentRequired"
];
        const updateData = req.body;
  const changedFields = {};

for (const key of editableFields) {

    if (updateData[key] === undefined || updateData[key] === null) {
        continue;
    }

    const oldValue = event[key];
    const newValue = updateData[key];

    if (
        JSON.stringify(oldValue) !==
        JSON.stringify(newValue)
    ) {

        changedFields[key] = {
            old: oldValue,
            new: newValue
        };

        event[key] = newValue;
    }
}
if (Object.keys(changedFields).length === 0) {
    return res.status(200).json({
        success: true,
        message: "No changes detected",
        data: event
    });
}
     

           const prompt =EditEventPrompt(changedFields,event.generatedPost);

            event.generatedPost = await generateResponse(prompt);
           
        
        await event.save();

        return res.status(200).json({
            success: true,
            message: "Event details updated successfully",
            data: event
        });




    } catch (err) {
        console.error("Edit Event Details Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};