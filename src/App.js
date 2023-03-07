import "./App.css";
import ConnectionButton from "./components/ConnectionButton";
import CreateBallot from "./pages/CreateBallot";
import ListOfBallot from "./pages/ListOfBallot";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import BallotDetails from "./pages/BallotDetails";

export const contractAddress = "0x7d1deeb98D7c3CA7279198DC42485fCA22ecBa70";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<ListOfBallot />} />
        <Route path="/create-ballot" element={<CreateBallot />} />
        <Route path="/:ballotAddress" element={<BallotDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
