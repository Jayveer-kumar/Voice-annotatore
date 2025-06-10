const express = require("express");
const Note = require("../models/Note");
const multer = require("multer");
const router = express.Router();
const  {OpenAI}=require("openai");
const fs=require("fs");
const path = require("path");
const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
})

const storage = multer.diskStorage({
    destination:'uploads/',
    filename:(req,res,cb)=>{
        cb(null,Date.now()+'.webm');
    }
});

const upload = multer({storage});

router.get("/",async(req,res)=>{
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch notes" });
  }
})

router.post('/',upload.single('audio'),async(req,res)=>{
    try{
      const {duaration,title}=req.body;
      const newNote = new Note({
        title: title || "Untitled",
        filename:req.file.filename,
        duaration:parseInt(duaration),
        createdAt:new Date(),
        transcript:"",
      })
      await newNote.save();
      res.status(201).json({success:true,note:newNote})
    } catch(err){
        console.error(err);
        res.status(500).json({success:false , error:"upload failed"});
    }
})

// Voice Delete Route
router.delete('/:id',async(req,res)=>{
  try{
    let voice = await Note.findByIdAndDelete(req.params.id);
    if(!voice) return res.status(500).json({success:false,message:"Note not found!"});
    // Also Delete from uploads folder
    const filePath = path.join(__dirname, '..', 'uploads', voice.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(200).json({success:true,message:"Voice Deleted successfully"})
    
  }catch(err){
   console.error("Delete error:", err);
   res.status(500).json({ success: false, error: "Failed to delete" });
  }
})
module.exports = router;