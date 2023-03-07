import "./App.css";
import ConnectionButton from "./components/ConnectionButton";
import CreateBallot from "./pages/CreateBallot";
import ListOfBallot from "./pages/ListOfBallot";

export const contractAddress = "0x7d1deeb98D7c3CA7279198DC42485fCA22ecBa70";

function App() {
  

  return (
    <div className="App">
      <ConnectionButton />


      {/* <CreateBallot /> */}


      <ListOfBallot />

      
    </div>
  );
}

export default App;
