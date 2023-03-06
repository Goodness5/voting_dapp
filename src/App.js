import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import "./App.css";
import ConnectionButton from "./components/ConnectionButton";
import Vote_Factory_Abi from "./utils/voting_factory.json";
import Ballot_Abi from "./utils/ballot.json";

const contractAddress = "0x9530E44031Bc09e2dafcc3b88Edd31A556C4398a";

function App() {
  const [name, setName] = useState("");
  const [period, setPeriod] = useState(null);
  const [tokenPerVote, setTokenPerVote] = useState(null);
  const [contenders1, setContenders1] = useState("");
  const [contenders2, setContenders2] = useState("");
  const [contenders3, setContenders3] = useState("");
  const [allContenders, setAllContenders] = useState([]);

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: Vote_Factory_Abi,
    functionName: "createBallot",
    args: [
      name,
      [contenders1, contenders2, contenders3],
      period,
      tokenPerVote,
    ],
  });

  const {data: voteFactoryData, isLoading: voteFactoryIsLoading, write: createBallot} = useContractWrite(config)


  const [voter1, setvoter1] = useState("");
  const [voter2, setvoter2] = useState("");
  const [voter3, setvoter3] = useState("");

  const {data: ballotName, isLoading: ballotIsLoading, isError: ballotIsError} = useContractRead({
    address: "0x789b976e837d7c0fae59d4e7cbdc86a56364cb68",
    abi: Ballot_Abi,
    functionName: 'name',
    args: [
      name,
      [contenders1, contenders2, contenders3],
      period,
      tokenPerVote,
    ],
  })





  const handleSubmit = (e) => {
    e.preventDefault()


  
    setTimeout(() => {
      console.log({name, period, tokenPerVote, contenders1, contenders2, contenders3})

      createBallot?.()
    }, 1000)
  }


  // 0x789b976e837d7c0fae59d4e7cbdc86a56364cb68

  useEffect(() => {
    if(voteFactoryData) {
      console.log(voteFactoryData);
    }
  }, [voteFactoryData])


  useEffect(() => {
    if(ballotName) {
      console.log(ballotName);
    }
  }, [ballotName])
  
  return (
    <div className="App">
      <ConnectionButton />



      <form onSubmit={handleSubmit}>


      <div className="">
          <label>Vote Name</label>
          <input
          type="text"
          placeholder="Name of Vote Campaign"
          onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="">
          <label>Contenders 1</label>
          <input
          type="text"
          placeholder="Name of Vote Campaign"
          onChange={(e) => setContenders1(e.target.value)}
          />
        </div>
        <div className="">
          <label>Contenders 2</label>
          <input
          type="text"
          placeholder="Name of Vote Campaign"
          onChange={(e) => setContenders2(e.target.value)}
          />
        </div>
        <div className="">
          <label>Contenders 3</label>
          <input
          type="text"
          placeholder="Name of Vote Campaign"
          onChange={(e) => setContenders3(e.target.value)}
          />
        </div>
        <div className="">
          <label>Vote Period</label>
          <input
          type="number"
          placeholder="Set Vote Period in seconds"
          onChange={(e) => setPeriod(e.target.value)}
          />
        </div>
        <div className="">
          <label>Token Per Vote</label>
          <input
          type="number"
          placeholder="Set token amount used in voting"
          onChange={(e) => setTokenPerVote(e.target.value)}
          />
        </div>


        <button type="submit">Submit</button>
      </form>


<form>
      <div className="vote">
      <label>candidate1:</label>
          <input
          type="text"
          placeholder="enter first candidate"
          onChange={(e) => setvoter1(e.target.value)}
          />
      </div>
      <div className="vote">
      <label>candidate2:</label>
          <input
          type="text"
          placeholder="enter second candidate"
          onChange={(e) => setvoter2(e.target.value)}
          />
      </div>
      <div className="vote">
      <label>candidate3:</label>
          <input
          type="text"
          placeholder="enter third candidate"
          onChange={(e) => setvoter3(e.target.value)}
          />
      </div>
      <button type="submit">Place Votes</button>

      </form>
    </div>
  );
}

export default App;
