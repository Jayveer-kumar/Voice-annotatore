require('dotenv').config();
const express=require("express");
const app = express();
const path=require("path");
const port=8080;
const mongoose = require("mongoose");
const cors=require('cors');
const notesRouter = require("./routes/notes");
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/VoiceAnnotatore');
  console.log("Database Connected SuccessFully!");
}
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/notes",notesRouter);
app.listen(port,()=>{
    console.log("Server is Running");
})