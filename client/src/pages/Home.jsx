import React from "react";
import LinkRecordButton from "../components/RecordLinkButton";
import RateThisApp from "../components/RateThisApp";
const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section Code Start Here */}
    <div className="h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJRvl7NTk0I6oHLrCzTrBDgWvmvddr9NtUg&s')",
      }}
     >
      <div className="text-white text-center p-10 rounded-xl shadow-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Capture Your Voice, Keep Your Thoughts</h1>
        <p className="text-lg md:text-xl">Record. Save. Transcribe. Search.</p>
        <LinkRecordButton message={"Get Stated."} />
      </div>      
    </div>
    {/* Hero Section Code End Here */}
    {/* Rate This App Section Start Here */}
    <div className="flex justify-center">
     <RateThisApp/>
    </div>
    {/* Rate This App Section End Here */}
    </div>
  );
};

export default Home;
