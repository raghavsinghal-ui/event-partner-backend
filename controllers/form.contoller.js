const mongoose = require('mongoose');
const eventmodel=require("../models/event.models");
const formmodel=require("../models/form.models");
const registrationModel = require("../models/registration.models");
exports.createForm=async(req,res)=>{try{
const {eventId,defaultFields,fields,documents}=req.body;
const event=await eventmodel.findById(eventId);
if(!event){
    return res.status(404).json({message:"Event not found"});   }

const isFormExist=await formmodel.findOne({eventInfo:eventId});
if(isFormExist){
    return res.status(400).json({message:"Form already exists for this event"});}
const allowedDefaultFields=["name","email","phone"];
for(const field of defaultFields){
    if(!allowedDefaultFields.includes(field.key)){
        return res.status(400).json({message:`Invalid default field: ${field.key}`});}
    
}
if(fields){
    for(const field of fields){
        if(!field.key || !field.type){
            return res.status(400).json({message:"Each field must have a key and type"});}
        
        if(!["text","number","select"].includes(field.type)){
            return res.status(400).json({message:`Invalid field type: ${field.type}`});}
        if(field.type==="select" && (!field.options || field.options.length===0)){
            return res.status(400).json({message:"Select fields must have options"});}}}

         if (documents) {
  for (const doc of documents) {

    if (typeof doc.key !== "string" || doc.key.trim() === "") {
      return res.status(400).json({
        message: "Document key must be a non-empty string"
      });
    }}}
      const form = new formmodel({
        eventInfo: eventId,
        defaultFields,      
        fields,
        documents
        });
        await form.save();  
        res.status(201).json({message:"Form created successfully",form});  
        
        
        
        
        
        
        
        
        
        }
catch(err){
    res.status(500).json({message:"Server error",error:err.message})
}}
exports.getForm = async (req, res) => {
  try {
    const { eventId } = req.query;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required"
      });
    }

    const form = await formmodel.findOne({ eventInfo:eventId });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found for this event"
      });
    }

    return res.status(200).json({
      success: true,
      data: form
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
function validateFields(schemaFields, userFields = {}) {
    const fieldMap = new Map();
    schemaFields.forEach(f => fieldMap.set(f.key, f));

    const sanitized = {};
    for (const [key, value] of Object.entries(userFields)) {

     
        if (!fieldMap.has(key)) {
            return { error: `Invalid field: ${key}` };
        }

        const schema = fieldMap.get(key);
        const val = value;

        if (schema.type === "string" && typeof value !== "string") {
            return { error: `${key} must be string` };
        }

        if (schema.type === "number" && typeof value !== "number") {
            return { error: `${key} must be number` };
        }

        if (schema.type === "boolean" && typeof value !== "boolean") {
            return { error: `${key} must be boolean` };
        }

        if (schema.type === "array" && !Array.isArray(value)) {
            return { error: `${key} must be array` };
        }

        sanitized[key] = val;
    }

   
    for (const [key, schema] of fieldMap.entries()) {
        if (schema.required && !(key in sanitized)) {
            return { error: `Missing required field: ${key}` };
        }
    }

    return { data: sanitized };
}



exports.submitForm = async (req, res) => {
    try {
        const { eventId,formId, defaultFields, fields, documents } = req.body;
        const userId = req.user.id; 
        const event = await eventmodel.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

      
        const form = await formmodel.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

    
        if (String(form.eventInfo) !== String(event._id)) {
            return res.status(400).json({ message: "Form does not belong to this event" });
        }
             
        const existing = await registrationModel.findOne({ userId, eventId });

        if (existing) {
            return res.status(400).json({ message: "Already registered for this event" });
        }


        const defaultRes = validateFields(form.defaultFields, defaultFields);
        if (defaultRes.error) {
            return res.status(400).json({ message: defaultRes.error });
        }

      
        
let fieldRes = { data: {} };
     if(form.fields && form.fields.length > 0)  {  fieldRes = validateFields(form.fields, fields);
        if (fieldRes.error) {
            return res.status(400).json({ message: fieldRes.error });
        }}

        // 🔸 5. Validate documents (optional)
        let documentRes = { data: {} };
        if (form.documents && form.documents.length > 0) {
            documentRes = validateFields(form.documents, documents);
            if (documentRes.error) {
                return res.status(400).json({ message: documentRes.error });
            }
        }

        const registration = await registrationModel.create({
            userId,
            eventId,
            formId,
            defaultFields: defaultRes.data,
            fields: fieldRes.data,
            documents: documentRes.data,
            status: "payment_pending",
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) 
        });

        return res.status(201).json({
            message: "Form submitted, proceed to payment",
            registrationId: registration._id
        });

    } catch (err) {
        return res.status(500).json({
            message: "Submission failed",
            error: err.message
        });
    }
};