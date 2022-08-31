const  { Block, Blockchain, Transaction}  = require("./src/blockchain")
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// const Generate = require("./src/keygenerator");
// console.log("generate",Generate());

// Your private key goes here
const myKey = ec.keyFromPrivate('765e1d5fed37306154d66a4da0f97e09e8bc21e8d615fe084aab3a0439ee37bc');

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

// Create new instance of Blockchain class
const AnilCoin = new Blockchain()

// Mine first block
console.log("\nStarting the miner....");
AnilCoin.minePendingTransactions(myWalletAddress);
console.log("\nBalance of Anil is : ", AnilCoin.getBalanceOfAddress(myWalletAddress));


// Create a transaction & sign it with your key
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 5);
tx1.signTransaction(myKey);
AnilCoin.addTransaction(tx1);

AnilCoin.minePendingTransactions(myWalletAddress);
console.log("\nBalance of Anil is : ", AnilCoin.getBalanceOfAddress(myWalletAddress));


const tx2 = new Transaction(myWalletAddress, 'address1', 50);
tx2.signTransaction(myKey);
AnilCoin.addTransaction(tx2);

// Mine block
AnilCoin.minePendingTransactions(myWalletAddress);
console.log("\nBalance of Anil is : ", AnilCoin.getBalanceOfAddress(myWalletAddress));


const tx3 = new Transaction(myWalletAddress, 'address1', 45);
tx3.signTransaction(myKey);
AnilCoin.addTransaction(tx3);

//// Mine block
AnilCoin.minePendingTransactions(myWalletAddress);
console.log("\nBalance of Anil is : ", AnilCoin.getBalanceOfAddress(myWalletAddress));

// Change the data
//AnilCoin.blockchain[2].transactions[0].amount =50
console.log("\nTotal Transaction of Anil is : ", AnilCoin.getAllTransactionsForWallet(myWalletAddress).length,"\n");
console.log("Is BlockChain Valid ?", AnilCoin.validateChainIntegrity());
//console.log(AnilCoin);
//console.log(JSON.stringify(AnilCoin, null, 5))






// Create Transaction Section
//AnilCoin.createTransaction(new Transaction("address1", "address2",100));
//AnilCoin.createTransaction(new Transaction("address2", "address1",50));
//
//console.log("\n Starting the miner....");
//AnilCoin.minePendingTransactions("Anil-address")
//
//console.log("\n Balance of Anil is : ", AnilCoin.getBalanceOfAddress("Anil-address"));
//
//console.log("\n Starting the miner Again....");
//AnilCoin.minePendingTransactions("Anil-address")
//
//console.log("\n Balance of Anil is : ", AnilCoin.getBalanceOfAddress("Anil-address"));
//console.log(AnilCoin);








//console.log("Mining AnilCoin in progress...");
// Add new Block
//console.log("Mining New Block.......");
//AnilCoin.addNewBlock(
//                    new Block("30/08/2022",
//                              { sender:"Anil Patidar",
//                                recipient:"Ajay Dangi",
//                                quantity:25
//                            })
//);
//
//AnilCoin.addNewBlock(
//    new Block("30/08/2022",
//              { sender:"Jitu",
//                recipient:"Anurag",
//                quantity:50
//            })
//);
//
//console.log("Is BlockChain Valid ?", AnilCoin.validateChainIntegrity());
//
//AnilCoin.addNewBlock(
//    new Block("30/08/2022",
//              { sender:"Ram",
//                recipient:"Gaurav",
//                quantity:10
//            })
//);

// update blockchain data n check its valid or not
// AnilCoin.blockchain[1].data = { 
// AnilCoin.blockchain[1].transactions = { 
//                             sender:"Ram",
//                             recipient:"Gaurav",
//                             quantity:40
// };
// 
// AnilCoin.blockchain[1].hash = AnilCoin.blockchain[1].generateHash()

//console.log("Is BlockChain Valid ?", AnilCoin.validateChainIntegrity());

//console.log(AnilCoin);
//console.log(JSON.stringify(AnilCoin, null, 5))
