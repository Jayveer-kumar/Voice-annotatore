import React, { useState, useRef } from "react";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import RateThisApp from "../components/RateThisApp";
function Record() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const [title, setTitle] = useState("");
  const [open, setOpen] = React.useState(false);
  const [showMessage,setShowMessage]=useState("");
  const [messageType, setMessageType] = useState("success");
  // Start Recording Function
  const startRecording = async () => {
    setAudioUrl(null); // clear previous recording
    setRecordingTime(0);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    };
    mediaRecorderRef.current.start();
    setRecording(true);

    // Timer
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    // Auto stop after 30 sec
    setTimeout(() => {
      if (mediaRecorderRef.current.state !== "inactive") {
        stopRecording();
      }
    }, 30000);
  };
  // Stop Recording Function
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef);
    }
  };
  // Save Voice Function
  const handleSaveAudio = async () => {
    if (!chunksRef.current.length) {
      setShowMessage("No audio data to save.");
      setMessageType("error");
      handleHideMessage();
      return;
    }
    if (!title) {
      alert("No Title Provided!");
      return;
    }
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", blob, `${Date.now()}.webm`);
    formData.append("duration", recordingTime);
    formData.append("title", title);
    try {
      const res = await fetch("http://localhost:8080/notes", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setShowMessage("Audio saved successfully!");
        setMessageType("success");
      } else {
        setShowMessage("Audio save failed.");
        setMessageType("error");
      }
    } catch (e) {
      setShowMessage("Something went wrong while saving.");
      setMessageType("error");
    }
    handleHideMessage();
  };
  // Dialog Box Open Handler
  const handleClickOpen = () => {
    setOpen(true);
  };
  // Dialog Box Close Handler
  const handleClose = () => {
    setOpen(false);
  };
  // Function for Hide Alert Messages
  const handleHideMessage = () => {
    setTimeout(() => {
      setShowMessage("");
    }, 3000);
  };
  return (
    <>
      <div className="flex flex-col justify-start align-center w-full ">
        {/* this is head container where user can start recording voice */}
        <div className="w-full min-h-[25em] max-h-[20em] bg-indigo-10 flex flex-col items-center justify-center text-center px-4 ">
          <h1 className="text-3xl md:text-5xl font-bold text-black-800 py-2">
            Voice Recorder
          </h1>
          <p className="text-sm md:text-base text-gray-700 mt-2 ">
            Record voice right from your browser
          </p>
          {/* main container where user show there live recording and stat & pouse function */}
          <div>
            <div className="mt-6 text-center">
              <div className="mb-4">
                {/* Means Recording is Stared */}
                {recording && (
                  <p className="text-lg font-semibold text-red-600">
                    Recording... {recordingTime}s
                  </p>
                )}
              </div>
              {/* Means Recording is Not Stared */}
              {!recording && (
                <button
                  onClick={startRecording}
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                >
                  Start Recording
                </button>
              )}
              {/* Means Recording is Stared , Now  We are able to Stop Recording */}
              {recording && (
                <button
                  onClick={stopRecording}
                  className="bg-red-600 text-white font-semibold px-6 py-2 rounded hover:bg-red-700 transition cursor-pointer"
                >
                  Stop Recording
                </button>
              )}
              {/* Means Recording is Recorded , Now We able to play Voice */}
              {audioUrl && (
                <div className="mt-6 text-center">
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    ▶️ Playback:
                  </p>
                  <audio controls src={audioUrl} className="w-72" />
                </div>
              )}
            </div>
          </div>
          {/* this Container for Save Voice in Database */}
          {audioUrl && (
            <div className="mt-2 bg-cyan-20">
              <React.Fragment>
                <Button variant="outlined" onClick={handleClickOpen}>
                  {" "}
                  Save Audio{" "}
                </Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      component: "form",
                      onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const titleFromForm = formJson.title;
                        setTitle(titleFromForm);
                        handleClose();
                      },
                    },
                  }}
                >
                  <DialogTitle>Voice Title</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To Save this Voice, please enter voice Title
                    </DialogContentText>
                    <TextField  onChange={(e) => setTitle(e.target.value)} value={title} autoFocus required margin="dense" id="name" name="title" label="Voice Title" type="text" fullWidth  variant="standard" />{" "}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSaveAudio} type="submit" >
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>
              </React.Fragment>
            </div>
          )}
        </div>
        {/* Display Alert message based on Backend Response */}
        {showMessage && (
          <Alert severity={messageType} className="mt-4 w-fit mx-auto">
            {showMessage}
          </Alert>
        )}
        {/* This is  first Show case box like what app does  */}
        <div className="w-full max-w-4xl px-6 py-10 text-left mx-auto">
          <h1 className="text-2xl font-semibold mb-4 text-black-800">
            Record Your Voice Online - Instantly and Easily
          </h1>
          <p className="text-gray-700 leading-relaxed">
            Our online voice recorder lets you record high-quality audio
            directly from your browser — no software download or plugins
            required. Whether you're creating a podcast, recording notes,
            practicing a speech, or saving an idea on the go, you can start
            recording in just one click. <br /> <br /> Designed for students,
            professionals, and creators, this tool works seamlessly on any
            device — desktop, tablet, or mobile. Your voice is safely recorded
            and stored right in your browser until you're ready to save or
            share.{" "}
          </p>
        </div>
        {/* This is second showcase box - about tools/features */}
        <div className="w-full max-w-4xl px-6 py-10 text-left mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-black-800">
            Use Our Free Online Voice Recorder and Enhance Your Audio Content
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Our online voice recorder is a powerful and easy-to-use tool that
            helps you capture high-quality voice recordings directly from your
            browser. Whether you're recording interviews, voice notes, podcasts,
            or practicing speeches, our tool is built to make the process
            seamless.
            <br />
            <br />
            In addition to recording, you can enhance your audio using optional
            editing features like trimming silence, adjusting volume levels, or
            combining multiple clips. These features allow you to polish your
            audio and create professional-level recordings effortlessly.
            <br />
            <br />
            With no need for downloads or plugins, your voice content is
            securely handled right in your browser — fast, free, and
            user-friendly.
          </p>
        </div>
        {/* Why Choose Us section */}
        <div className="w-full bg-gray-50 py-12 mx-auto ">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-black-800 mb-8">
              Why Choose Us
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-left">
              {/* Card 1 */}
              <div className="bg-white  rounded-lg p-5 flex gap-4 items-start">
                <div className="text-cyan-600 text-2xl">
                  {" "}
                  <AcUnitIcon />{" "}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
                  <p className="text-gray-600">
                    Our voice recorder is beginner-friendly with a clean
                    interface. Start recording with just one click — no setup
                    needed.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white  rounded-lg p-5 flex gap-4 items-start">
                <div className="text-cyan-600 text-2xl">
                  <AcUnitIcon />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Works on Any Device
                  </h3>
                  <p className="text-gray-600">
                    Record your voice seamlessly on desktop, tablet, or
                    smartphone — fully optimized for all screen sizes.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white  rounded-lg p-5 flex gap-4 items-start">
                <div className="text-cyan-600 text-2xl">
                  <AcUnitIcon />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    No Downloads Required
                  </h3>
                  <p className="text-gray-600">
                    Just open our website and start recording — no software, no
                    plugin, no hassle.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white  rounded-lg p-5 flex gap-4 items-start">
                <div className="text-cyan-600 text-2xl">
                  <AcUnitIcon />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Free to Use</h3>
                  <p className="text-gray-600">
                    Record your voice at no cost. We also offer premium options
                    for power users who need more.
                  </p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="bg-white  rounded-lg p-5 flex gap-4 items-start">
                <div className="text-cyan-600 text-2xl">
                  <AcUnitIcon />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Built-in Audio Editor
                  </h3>
                  <p className="text-gray-600">
                    Trim silence, adjust volume, or merge clips with our
                    built-in editor — all in your browser.
                  </p>
                </div>
              </div>

              {/* Card 6 */}
              <div className="bg-white  rounded-lg p-5 flex gap-4 items-start">
                <div className="text-cyan-600 text-2xl">
                  <AcUnitIcon />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Secure & Private
                  </h3>
                  <p className="text-gray-600">
                    We use secure servers and end-to-end encryption to protect
                    your voice recordings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Rate This App Section */}
        <div className="flex justify-center"> 
          <RateThisApp/>
        </div>
      </div>
    </>
  );
}

export default Record;
