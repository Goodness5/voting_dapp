import React, { useEffect, useState } from "react";
import { useContractRead, useContractReads } from "wagmi";
import { contractAddress } from "../App";
import Vote_Factory_Abi from "../utils/voting_factory.json";
import Ballot_Abi from "../utils/ballot.json";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

const ListOfBallot = () => {
  const [ballotNameLoading, setballotNameLoading] = useState(false);


  const { data: ballots, isLoading: ballotLoading } = useContractRead({
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
    setballotNameLoading(true);
    try {
      if (ethereum) {
        const ballotNameArray = [];

        for (let i = 0; i < ballots.length; i++) {
          let address = ballots[i];

          const provider = new ethers.providers.JsonRpcProvider(
            "https://eth-sepolia.g.alchemy.com/v2/uZGR55UymScIXoqPP4f3JQ0nix_Ry88e"
          );

          const ballotContract = new ethers.Contract(
            address,
            Ballot_Abi,
            provider
          );

          const ballotName = await ballotContract.name();

          ballotNameArray.push({ ballotName, address });
        }
        // const provider =  new ethers.providers.Web3Provider(ethereum)

        setBallotVoteName(ballotNameArray);
      }

      setballotNameLoading(false);
    } catch (error) {
      console.log(error);
      setballotNameLoading(false);
    }
  };

  useEffect(() => {
    if (ballots?.length > 0) {
      fetchBallotName();
    }
  }, [ballots]);

  return (
    <div className="mt-10">
      {ballotLoading || ballotNameLoading ? (
        <div className="text-center">THE PAGE IS LOADING!</div>
      ) : (
        <div className="grid grid-cols-4 gap-5">
          {ballotVoteName.map((ballot, _i) => {
            return (
              <Link
                to={`${ballot.address}`}
                key={_i}
                className="col-span-1 border border-teal-400 rounded-xl p-4 mb-4 cursor-pointer"
              >
                <div className="flex">
                  Name: <span className="">{ballot.ballotName}</span>
                </div>
                <div className="flex">
                  Address:{" "}
                  <span className="">{`${ballot.address.slice(
                    0,
                    6
                  )}...${ballot.address.slice(-4)}`}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListOfBallot;
