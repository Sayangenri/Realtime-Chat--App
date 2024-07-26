import './App.css';
import io from "socket.io-client";
import {useState} from "react";

const socket = io.connect("http://localhost:3001/")

function App() {

  const [username,setusername] = useState("");
  const [room,setroom] = useState("");

  const joinroom = () =>{
    if(username!=="" && room !==""){

    }
  };


  return (
    <div className="App">
      <h3>Join Chat</h3>
      <input type="text" placeholder="John..." onChange={(event)=>{setusername(event.target.value)}} />
      <input type="text" placeholder="Room id..." onChange={(event)=>{setroom(event.target.value)}} />
    <button>Join A Room</button>
    </div>
  );
}

export default App;
