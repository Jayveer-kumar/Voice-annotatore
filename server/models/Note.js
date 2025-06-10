// This is Schema file for Audio 
const mongoose=require("mongoose");
const noteSchema = mongoose.Schema({
    title: String,  
    filename: String,
    duration:Number,
    createdAt:{
        type:Date,
        default:Date.now()
    },
    transcript:String
})

module.exports= mongoose.model("Note",noteSchema);

// Transcript kya hota hai?
// Transcript = audio recording ka likha hua version (text form)