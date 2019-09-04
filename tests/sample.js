/*
sample output must be:
openlibs/eth/tests# node sample
Tether USD
USDT
0
*/

var Eth = require('../uranik-eth-lib');

(async () => {
	try{
		let eth = new Eth();
		let contractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7"; // Tether USD USDT erc20 token
		let ethAddress = "0xF8C200982f0328DbEA9D7c1cD6848043c182D55f"; // any valid eth address for test
		
		//let addrobj = await eth.getNewAddress(); // for create new eth address in local wallet
		//let balanceEth = await eth.getBalance(addrobj.address); // get eth balance for addrobj.address

		//let mainEthAddress=await eth.mainAccount(); // get first main eth address in local weallet
		//console.log({balanceEth,mainEthAddress});
		
		// erc20 token methods sample
		eth.token.setTokenContract( contractAddress );
		let name= await eth.token.getName();
		let symbol= await eth.token.getSymbol();
		let balance= await eth.token.getBalance(ethAddress);
		console.log(name);
		console.log(symbol);
		console.log(balance);
		process.exit();
	}
	catch(err){
		console.log(err);
		process.exit();
	}
})();
