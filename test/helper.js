const {Blockchain, Transaction} = require("../src/blockchain");
const EC = require("elliptic").ec;
var ec = new EC("secp256k1");
const signingKey = ec.keyFromPrivate('765e1d5fed37306154d66a4da0f97e09e8bc21e8d615fe084aab3a0439ee37bc');

function CreateSignedTx(amount = 10){
    const txObject = new Transaction(signingKey.getPublic('hex'), "wallet2",amount);
    txObject.timestamp = 1;
    txObject.signTransaction(signingKey);

    return txObject;
}

function CreateBCWithMined(){
    const blockchain = new Blockchain();
    blockchain.minePendingTransactions(signingKey.getPublic('hex'));

    return blockchain;
}

function CreateBlockchainWithTx(){
    const blockchain = new Blockchain();
    blockchain.minePendingTransactions(signingKey.getPublic('hex'));

    const validTx = new Transaction(signingKey.getPublic('hex'),'b2',10);
    validTx.signTransaction(signingKey);

    blockchain.addTransaction(validTx);
    blockchain.addTransaction(validTx);
    blockchain.minePendingTransactions(1);

    return blockchain;
}


module.exports = {
    CreateSignedTx,
    CreateBCWithMined,
    CreateBlockchainWithTx,

}