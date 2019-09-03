'use strict';
var Web3 = require('web3')
var net = require('net');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));  //rpc
//var web3 = new Web3('\\\\.\\pipe\\geth.ipc', net); // ipc

// The minimum ABI to get ERC20 Token balance and name and symbol info
let minABI = [
  //name
  {"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
  //symbol
  {"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];


class Token{
	constructor() {
		//stub
	}
}



class Eth{
	constructor() {
		this.token=new Token();
	}
	async getNewAddress(){
		var addrobj = await web3.eth.accounts.create();
		return addrobj;
	}
	async getBalance(addr){
		return await web3.eth.getBalance(addr);
	}
	async mainAccount(){
		var addressArr = await web3.eth.getAccounts();
		if(!addressArr || addressArr.length===0){
			throw new Error('error get main eth address');
		}
		return addressArr[0];
	}
	async transfer(fromAddr,toAddr, value){
		var localKeys = await web3.eth.getAccounts();
		var personalAccount = localKeys[0];
		const tx = await web3.eth.sendTransaction({to: toAddr, from: fromAddr, value: value });
		return tx;
	}
}

module.exports = Eth;
