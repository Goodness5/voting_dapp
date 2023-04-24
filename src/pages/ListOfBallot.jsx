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

    function HomePage({ ballotLoading, ballotNameLoading, ballotVoteName }) {
      return (
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-10">Welcome to My Voting App!</h1>
          <div className="grid grid-cols-3 gap-8">
            {ballotLoading || ballotNameLoading ? (
              <div className="text-center col-span-3">
                Loading ballot data...
              </div>
            ) : (
              <>
                {ballotVoteName.map((ballot, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
                  >
                    <Link to={`${ballot.address}`}>
                      <div className="p-4">
                        <h2 className="text-2xl font-bold mb-2">
                          Ballot Name: {ballot.ballotName}
                        </h2>
                        <p className="text-gray-700">
                          Address: {`${ballot.address.slice(0, 6)}...${ballot.address.slice(-4)}`}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      );
    }
  )};

export default ListOfBallot;
