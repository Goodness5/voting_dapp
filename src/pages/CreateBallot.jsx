import React from "react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Vote_Factory_Abi from "../utils/voting_factory.json";
import Ballot_Abi from "../utils/ballot.json";
import { contractAddress } from "../App";

const CreateBallot = () => {
  const [name, setName] = useState("");
  const [period, setPeriod] = useState(null);
  const [tokenPerVote, setTokenPerVote] = useState(null);

  const [addressList, setAddressList] = useState([{ address: "" }]);

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: Vote_Factory_Abi,
    functionName: "createBallot",
    args: [
      name,
      addressList.map((nm_) => nm_.address),
      period ?? "0",
      tokenPerVote ?? "0",
    ],
  });

  const {
    data: voteFactoryData,
    isLoading: voteFactoryIsLoading,
    write: createBallot,
  } = useContractWrite(config);

  const { data: voteFactoryWaitData, isLoading: voteFactoryWaitIsLoading } =
    useWaitForTransaction({
      data: voteFactoryData?.hash,

      onSuccess(data) {
        console.log("IT IS SUCCESSFUL: ", data);
      },

      onError(error) {
        console.log("Encountered error: ", error);
      },
    });

  const {
    data: ballotName,
    isLoading: ballotIsLoading,
    isError: ballotIsError,
  } = useContractRead({
    address: "0x789b976e837d7c0fae59d4e7cbdc86a56364cb68",
    abi: Ballot_Abi,
    functionName: "name",
  });

  // 0x789b976e837d7c0fae59d4e7cbdc86a56364cb68

  useEffect(() => {
    if (voteFactoryData) {
      console.log(voteFactoryData);
    }
  }, [voteFactoryData]);

  useEffect(() => {
    if (ballotName) {
      console.log(ballotName);
    }
  }, [ballotName]);

  const handleAddressChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...addressList];
    list[index][name] = value;
    setAddressList(list);
  };

  const handleAddressRemove = (index) => {
    const list = [...addressList];
    list.splice(index, 1);
    setAddressList(list);
  };

  const handleAddressAdd = () => {
    setAddressList([...addressList, { address: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createBallot?.();
  };
  return (
<form onSubmit={handleSubmit} className="bg-gray-700 w-8/12 m-auto mt-9 px-6 py-8 rounded-lg">
  <div className="mb-4">
    <label className="block text-gray-200 mb-1 font-semibold">Vote Name</label>
    <input
      type="text"
      placeholder="Name of Vote Campaign"
      onChange={(e) => setName(e.target.value)}
      className="w-full p-2 bg-gray-800 rounded-lg border border-gray-600 text-gray-200"
    />
  </div>

  {addressList.map((singleAddress, index) => (
    <div key={index} className="services flex mb-2">
      <div className="first-division w-full mr-2">
        <input
          name="address"
          type="text"
          id="address"
          className="w-full p-2 bg-gray-800 rounded-lg border border-gray-600 text-gray-200 add__wallet__input"
          onChange={(e) => handleAddressChange(e, index)}
          required
          placeholder="Enter admin member's address"
        />
        {addressList.length - 1 === index && addressList.length < 10 && (
          <button
            onClick={handleAddressAdd}
            type="submit"
            className="w-full p-2 mt-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-gray-200 font-semibold add__address__btn"
          >
            Add Name
          </button>
        )}
      </div>

      <div className="second-division">
        {addressList.length !== 1 && (
          <button
            type="button"
            onClick={() => handleAddressRemove(index)}
            className="bg-red-600 hover:bg-red-700 text-gray-200 font-semibold px-3 py-2 rounded-full remove-btn"
          >
            -
          </button>
        )}
      </div>
    </div>
  ))}

  <div className="mb-4">
    <label className="block text-gray-200 mb-1 font-semibold">Vote Period</label>
    <input
      type="number"
      placeholder="Set Vote Period in seconds"
      onChange={(e) => setPeriod(e.target.value)}
      className="w-full p-2 bg-gray-800 rounded-lg border border-gray-600 text-gray-200"
    />
  </div>
  
  <div className="mb-4">
    <label className="block text-gray-200 mb-1 font-semibold">Token Per Vote</label>
    <input
      type="number"
      placeholder="Set token amount used in voting"
      onChange={(e) => setTokenPerVote(e.target.value)}
      className="w-full p-2 bg-gray-800 rounded-lg border border-gray-600 text-gray-200"
    />
  </div>

  <button type="submit" className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-lg text-gray-200 font-semibold">
    {voteFactoryIsLoading || voteFactoryWaitIsLoading
      ? "Loading..."
      : "Submit"}
  </button>
</form>

  );
};

export default CreateBallot;
