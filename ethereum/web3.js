import Web3 from "web3";
import {infura} from './deploy'
 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    infura.endpoints.ropstein
  );
  web3 = new Web3(provider);
}
 
export default web3;
