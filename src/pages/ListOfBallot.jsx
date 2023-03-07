import React, { useEffect, useState } from "react";
import { useContractRead, useContractReads } from "wagmi";
import { contractAddress } from "../App";
import Vote_Factory_Abi from "../utils/voting_factory.json";
import Ballot_Abi from "../utils/ballot.json";
import { ethers } from "ethers";

const ListOfBallot = () => {
  const { data: ballots } = useContractRead({
    address: contractAddress,
    abi: Vote_Factory_Abi,
    functionName: "listOfBallots",
  });

  //   let ballotArray = [];

  //   if (ballots?.length > 0) {
  //     for (let i = 0; i < ballots.length; i++) {
  //       ballotArray.push({
  //         address: ballots[i],
  //         abi: Ballot_Abi,
  //         functionName: "name",
  //       });
  //     }
  //   }

  //   const { data: ballotName } = useContractReads({
  //     contract: ballotArray[i],
  //   })

  // console.log({ ballotName });

  const [ballotVoteName, setBallotVoteName] = useState([]);

  const fetchBallotName = async () => {
    const { ethereum } = window;

    if (ethereum) {




      const ballotNameArray = [];



      for (let i = 0; i < ballots.length; i++) {

        let address = ballots[i]
        
        const provider = new ethers.providers.JsonRpcProvider(
          "https://eth-sepolia.g.alchemy.com/v2/uZGR55UymScIXoqPP4f3JQ0nix_Ry88e"
        );

        const ballotContract = new ethers.Contract(address, Ballot_Abi, provider);

        const ballotName = await ballotContract.name();

        ballotNameArray.push({ballotName, address});
      }
      // const provider =  new ethers.providers.Web3Provider(ethereum)

      setBallotVoteName(ballotNameArray);
    }
  };

  useEffect(() => {
    if (ballots?.length > 0) {
      fetchBallotName();
    }
  }, [ballots]);

  if (ballotVoteName.length > 0) {
    console.log({ ballotVoteName });
  }

  return <div>
    {
        ballotVoteName.map((ballot, _i) => {
            return (
                <div key={_i} className="border border-teal-400 h-16 rounded-xl p-4 mb-4">

                    <div className="">Name: <span className="">{ballot?.ballotName}</span></div>
                    <div className="">Address: <span className="">{ballot?.address}</span></div>

                    </div>
            )
        })
    }
  </div>;
};

export default ListOfBallot;
