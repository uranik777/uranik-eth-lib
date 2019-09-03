'use strict';
var Web3 = require('web3')
var net = require('net');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));  //rpc
//var web3 = new Web3('\\\\.\\pipe\\geth.ipc', net); // ipc

class Token{
	constructor() {
		//stub
	}
}



class Eth{
	constructor() {
		this.token=new Token();
	}
}

module.exports = Eth;
