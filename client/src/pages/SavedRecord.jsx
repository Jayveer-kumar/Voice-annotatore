import React, { useEffect, useState } from "react";
import LinkRecordButton from "../components/RecordLinkButton";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import RateThisApp from "../components/RateThisApp";
function SavedRecord() {
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [showMessage,setShowMessage]=useState("");
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");  
  const [messageType, setMessageType] = useState("success");
  const [selectedVoice,setSelectedVoice]=useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("http://localhost:8080/notes/");
        const data = await res.json();
        if (data.success) {
          setNotes(data.notes);
          setAllNotes(data.notes);
        }
      } catch (e) {
        console.error(e);
        console.log("Some Error Occured while Fetching Audio!");
      }
    };
    fetchNotes();
  }, []);

  const handleVoiceDelete=async(id)=>{
    if (!selectedVoice) return;
    try{
      const res = await fetch(`http://localhost:8080/notes/${selectedVoice}`,{
        method:"DELETE"
      })
      const data = await res.json();
      if(data.success){
        setNotes((prev) => prev.filter((note) => note._id !== selectedVoice));
        setOpen(false);
        setShowMessage("Audio saved successfully!");
        setMessageType("success");
      }else{
        setShowMessage("Not Deleted Try Again!");
        setMessageType("error");
        handleHideMessage();
      }
    }catch(err){
      setShowMessage("Something went wrong while saving.");
      setMessageType("error");
    }
    handleClose(false);
    handleHideMessage();
  }
  const handleHideMessage = () => {
    setTimeout(() => {
      setShowMessage("");
    }, 3000);
  };

  const handleSearch = () => {
    const filtered = allNotes.filter(
      (note) =>
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.transcript?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setNotes(filtered);
  };



  return (
    <>
      <div className="flex flex-col">
        {/* Showcase box start here  */}
        <div
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex flex-col items-center justify-center text-center px-6"
          style={{ minHeight: "12em" }}
        >
          <h2 className="text-2xl font-bold max-w-xl">
            Your voice memories are ready to play anytime, anywhere.
          </h2>
          <div>
            <LinkRecordButton message={" Capture new voice"} />
          </div>
        </div>
        {/* Showcase box End here */}

        {/* Search functionality start Here */}
        <div className="mb-6 w-full max-w-md mx-auto">
          <form  onSubmit={(e) => {
              e.preventDefault();
              handleSearch(); 
            }} className="flex items-center gap-2 my-3" >
            <input type="text" placeholder="Search voice by title or transcript..."  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-4 py-2 border rounded shadow" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">Search </button>
            {searchQuery && (
            <button onClick={() => {setNotes(allNotes); setSearchQuery("");}} className="text-blue-600 underline text-sm ml-4 cursor-pointer" >Reset </button>
            )}
          </form>
        </div>

        {/* Search functionality End Here */}
        {/* all Recordings card */}
        <div className="py-6 px-4 bg-gray-100">
          <div className="flex flex-col sm:flex-row sm:space-x-6 sm:overflow-x-auto sm:min-w-max gap-4">
            {notes.map(({ _id, filename, title, createdAt }) => (
              <div data-aos="fade-up" data-aos-offset="200"  data-aos-delay="50" key={_id}  className="bg-white rounded-lg shadow-md p-4 w-full sm:w-60 flex-shrink-0 relative" >
                <Tooltip title="Delete">
                  <IconButton
                    style={{
                      position: "absolute",
                      top: "0.25em",
                      right: "0.25em",
                      color: "#ef4444",
                    }}
                    size="small"
                    onClick={() => {
                      setSelectedVoice(_id);
                      setOpen(true);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* here we added a Delete Voice Box  */}

                <React.Fragment>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                    maxWidth="xs"
                    fullWidth
                    slotProps={{
                      backdrop: {
                        sx: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
                      },
                    }}
                  >
                    <DialogTitle id="responsive-dialog-title">
                      {"Are you sure you want to delete?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        This action cannot be undone. The voice file will be
                        permanently removed.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button autoFocus onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleVoiceDelete(_id)}
                        autoFocus
                        color="error"
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>

                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  {new Date(createdAt).toLocaleString()}
                </p>
                <audio controls className="w-full rounded">
                  <source
                    src={`http://localhost:8080/uploads/${filename}`}
                    type="audio/webm"
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
          {showMessage && (
            <Alert severity={messageType} className="mt-4 w-fit mx-auto">
              {showMessage}
            </Alert>
          )}
        </div>
        {/* if there is no any notes then display a simple message */}
        {notes.length === 0 && (
          <div className=" text-center text-gray-700 mt-10">
            <h2 className="text-xl font-semibold">
              No voice notes available yet.
            </h2>
            <p className="mt-2">
              Click on "Capture new voice" to create your first voice note
            </p>
          </div>
        )}
        <div className="flex justify-center">
          <RateThisApp />
        </div>
      </div>
    </>
  );
}

export default SavedRecord;
