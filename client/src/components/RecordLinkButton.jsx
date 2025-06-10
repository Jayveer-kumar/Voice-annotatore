import { Link } from "react-router-dom";

function LinkRecordButton({message}) {
  return (
    <Link to="/record" >
      <button className="bg-white text-black py-3 px-6 mt-3 rounded-lg cursor-pointer">
        {message}
      </button>
    </Link>
  );
}

export default  LinkRecordButton ;
