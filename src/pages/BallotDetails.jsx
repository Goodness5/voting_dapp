import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Ballot_Abi from "../utils/ballot.json";
import PVC_Abi from "../utils/pvc.json";

const BallotDetails = () => {
  const { ballotAddress } = useParams();
  const { address } = useAccount();

  const [contender1, setContender1] = useState("");
  const [contender2, setContender2] = useState("");
  const [contender3, setContender3] = useState("");

  const { data: ballots, isLoading: ballotLoading } = useContractRead({
    address: ballotAddress,
    abi: Ballot_Abi,
    functionName: "name",
  });

  const { data: allowance, isLoading: allowanceLoading } = useContractRead({
    address: "0xDA57a96E31148FD1992Ef3dE08742F3DAEAee369",
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, ballotAddress],
  });

  console.log("ALLOWANCE: ", String(allowance));

  const {
    data: approveBallotData,
    isLoading: isLoadingBallotData,
    write: approveBallot,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: "0xDA57a96E31148FD1992Ef3dE08742F3DAEAee369",
    abi: erc20ABI,
    functionName: "approve",
    args: [ballotAddress, 6],
  });

  const { data: approveBallotWaitData, isLoading: isLoadingBallotWaitData } =
    useWaitForTransaction({
      hash: approveBallotData?.hash,

      onSuccess(data) {
        console.log(data);
        console.log("APPROVE SUCCESSFUL");
        vote?.();
      },
      onError(error) {
        console.log(error);
      },
    });

  const {
    data: voteData,
    isLoading: voteIsLoading,
    write: vote,
  } = useContractWrite({
    address: ballotAddress,
    abi: Ballot_Abi,
    functionName: "vote",
    args: [[contender1, contender2, contender3]],
  });

  const { data: voteWaitData, isLoading: voteIsLoadingWaitData } =
    useWaitForTransaction({
      hash: voteData?.hash,

      onSuccess(data) {
        console.log(data);
        console.log("VOTE SUCCESSFUL");
        alert("SUCCESS");
      },
      onError(error) {
        console.log(error);
      },
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    approveBallot?.();
  };

  const { data: winnerData, isLoading: winnerIsLoading } = useContractRead({
    address: ballotAddress,
    abi: Ballot_Abi,
    functionName: "winner",
  });

  console.log("winnerData: ", winnerData);

  return (
    <div className="">
      <div className="flex items-center justify-between mt-10 px-8">
        <div>
          <div className="">Ballot Name: {ballots}</div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block">Contender 1</label>
              <input
                type="text"
                className="p-2 border border-orange-400"
                placeholder="Contender 1"
                onChange={(e) => setContender1(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block">Contender 2</label>
              <input
                type="text"
                className="p-2 border border-orange-400"
                placeholder="Contender 2"
                onChange={(e) => setContender2(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block">Contender 3</label>
              <input
                type="text"
                className="p-2 border border-orange-400"
                placeholder="Contender 3"
                onChange={(e) => setContender3(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="px-7 py-2 border border-blue-300 rounded-lg"
            >
              {isLoadingBallotData ||
              isLoadingBallotWaitData ||
              voteIsLoading ||
              voteIsLoadingWaitData
                ? "LOADING..."
                : "Vote"}
            </button>
          </form>
        </div>

        <BuyToken />
      </div>

      <div className="flex justify-center items-center">
        {/* <button type="submit" onClick={}>CheckWinner</button> */}
      </div>
    </div>
  );
};

export default BallotDetails;

const BuyToken = () => {
  const { address } = useAccount();
  const [amountToPay, setAmountToPay] = useState(null);
  const [amountToGet, setAmountToGet] = useState(null);

  const {
    data: buyTokenData,
    isLoading: buyTokenIsLoading,
    write: buyToken,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: "0xDA57a96E31148FD1992Ef3dE08742F3DAEAee369",
    abi: PVC_Abi,
    functionName: "buyToken",
    args: [amountToGet],
    overrides: {
      value: amountToPay,
    },
  });

  const {
    data: buyTokenWaitData,
    isSuccess: buyTokenIsSuccess,
    isLoading: buyTokenWaitIsLoading,
  } = useWaitForTransaction({
    data: buyTokenData?.hash,

    onSuccess(data) {
      console.log("GOOD GOOD: ", data);
    },
    onError(error) {
      console.log("BAD BAD: ", error);
    },
  });

  useEffect(() => {
    if (buyTokenIsSuccess) {
      console.log("OUR BUY TOKEN IS SUCCESSFUL");
    }
  }, [buyTokenIsSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();

    buyToken?.();
  };

  const { data: balanceOf, isLoading: balanceOfLoading } = useContractRead({
    address: "0xDA57a96E31148FD1992Ef3dE08742F3DAEAee369",
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [address],
  });


  console.log("My balance is: ", String(balanceOf));

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="">
        <div className="mb-3">
          <label className="block">Amount To Pay</label>
          <input
            type="text"
            placeholder="Amount To Pay"
            className="p-2 border border-orange-400"
            onChange={(e) => setAmountToPay(e.target.value)}
          />
        </div>

        <div className="">
          <label className="block">Amount To Get</label>
          <input
            type="text"
            placeholder="Amount To Pay"
            className="p-2 border border-orange-400"
            onChange={(e) => setAmountToGet(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="px-7 py-2 border border-blue-300 rounded-lg"
        >
          {buyTokenIsLoading || buyTokenWaitIsLoading ? "Loading..." : "Buy"}
        </button>
      </form>
    </div>
  );
};
