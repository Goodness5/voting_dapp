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
    <form onSubmit={handleSubmit}>
      <div className="">
        <label>Vote Name</label>
        <input
          type="text"
          placeholder="Name of Vote Campaign"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {addressList.map((singleAddress, index) => (
        <div key={index} className="services flex">
          <div className="first-division">
            <input
              name="address"
              type="text"
              id="address"
              className="form-control add__wallet__input"
              // value={singleAddress.address}
              onChange={(e) => handleAddressChange(e, index)}
              required
              placeholder="Enter admin member's address"
            />
            {addressList.length - 1 === index && addressList.length < 10 && (
              <button
                onClick={handleAddressAdd}
                type="submit"
                className="add__address__btn"
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
                className="remove-btn"
              >
                -
              </button>
            )}
          </div>
        </div>
      ))}

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

      <button type="submit">
        {voteFactoryIsLoading || voteFactoryWaitIsLoading
          ? "LOading..."
          : "Submit"}
      </button>
    </form>
  );
};

export default CreateBallot;
