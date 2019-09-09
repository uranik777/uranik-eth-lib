'use strict';
var Web3 = require('web3')
var net = require('net');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8588'));  //rpc 8545 real eth net,  8588 rolsen testnet
//var web3 = new Web3('\\\\.\\pipe\\geth.ipc', net); // ipc connection

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
	setTokenContract(contractAddress){
		this.contract = new web3.eth.Contract(minABI,contractAddress);
	}
	async getName(){
		let name=await this.contract.methods.name().call();
		return name;
	}
	async getSymbol(){
		let symbol=await this.contract.methods.symbol().call();
		return symbol;
	}
	async getBalance(ethaddress){
		let balance=await this.contract.methods.balanceOf(ethaddress).call();
		let decimals = await this.contract.methods.decimals().call();
		return balance/Math.pow(10,decimals);
	}
	async transfer(fromAddr,toAddr, value){
		throw new Error('not implemented now');
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


	// return balance in ETH
	async getBalance(addr,blocknumber){
		let balance;
		if(blocknumber){
			balance =await web3.eth.getBalance(addr,blocknumber); 
		}else{
			balance =await web3.eth.getBalance(addr); 
		}
		let ethBalance=await web3.utils.fromWei(balance, 'ether');
		return ethBalance;
	}

	// return balance in Wei
	async getBalanceWei(addr,blocknumber){
		let balance;
		if(blocknumber){
			balance =await web3.eth.getBalance(addr,blocknumber); 
		}else{
			balance =await web3.eth.getBalance(addr); 
		}
		let WeiBalance=balance;
		return WeiBalance;
	}

	async getBlockNumber(){
		return await web3.eth.getBlockNumber();
	}

	async mainAccount(){
		var addressArr = await web3.eth.getAccounts();
		if(!addressArr || addressArr.length===0){
			throw new Error('error get main eth address');
		}
		return addressArr[0];
	}

	// async transfer(fromAddr,toAddr, value){
	// 	var localKeys = await web3.eth.getAccounts();
	// 	var personalAccount = localKeys[0];
	// 	const tx = await web3.eth.sendTransaction({to: toAddr, from: fromAddr, value: value });
	// 	return tx;
	// }


	// call any web3.eth method
	async call(method,params=null){
		if(params===null){
			return await web3.eth[method]();
		}else{
	        let args=[];
	        for(let i=1;i<arguments.length;i++){
	        	args.push(arguments[i]);
	        }
	        return await web3.eth[method].apply(this, args);
		}
	}


	// params is object {to,skey,amount,fee}
	// where amount in ETH, fee in ETH
	// to - destination address
	// skey - private key
	async sendRawTx(params){
		var Tx = require('ethereumjs-tx').Transaction;		
		//var privateKey = Buffer.from(params.skey, 'hex');
		if(!params.to || !params.skey || typeof params.amount == "undefined"){
			throw new Error('bad arguments');
		}
		if(params.amount<0){
			throw new Error('amount less 0');
		}

		let gasPrice=await web3.eth.getGasPrice();
		let wei=await web3.utils.toWei( String(params.amount) , "ether");
		let gasLimit='21000'; // standart limit for send ETH coins

		let weifee=Math.round( (+gasPrice)*(+gasLimit) );
		let ethfee=await web3.utils.fromWei(String(weifee), 'ether');

		let txGasPrice;
		if(params.fee)
			txGasPrice= String( Math.round( await web3.utils.toWei( String(params.fee) , "ether")/21000 ) );
		else
			txGasPrice= gasPrice;

		let gasamount=(+txGasPrice)*21000;

		let wei2=Math.round(+wei-gasamount);

		let txObj={
		    to: params.to,
		    value: web3.utils.toHex( String(wei2) ),
		    gasLimit: gasLimit,
		    gasPrice: String( Math.round(txGasPrice) )
		};
		if(params.nonce){
		    txObj.nonce=params.nonce;
		}

		let rawtx=await web3.eth.accounts.signTransaction(txObj, params.skey);

		if(!rawtx.rawTransaction){
			throw new Error('error create raw transaction');
		}

		function getHashAndSendSignedTransaction() {		
			return new Promise( function(resolve, reject) {
				web3.eth.sendSignedTransaction(rawtx.rawTransaction)
				.on('transactionHash', function(hash){ return resolve(hash) })
				.on('error', function(error){return reject(error)});
			});
		}
		let res=await getHashAndSendSignedTransaction();
		return res; // return hash example 0x452dfcc00d44af1624b74bbd02809c200feffeb3
	}
}

module.exports = Eth;
