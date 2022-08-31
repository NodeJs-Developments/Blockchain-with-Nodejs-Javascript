'use strict';
//import that secure hash algorithm from the crypto-js package
const SHA256 = require("crypto-js/sha256");
const  Base64 = require('crypto-js/enc-base64');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');




class Transaction {

    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    generateHashes(){
        //console.log(Base64.stringify(SHA256(this.fromAddress + this.toAddress + this.amount).toString()));
        return (SHA256(this.fromAddress + this.toAddress + this.amount).toString());
    }

    signTransaction(signingKey){

        if(signingKey.getPublic('hex') !== this.fromAddress)
        {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        // Calculate the hash of this transaction, sign it with the key
        // and store it inside the transaction object
        const hashTx = this.generateHashes();
        const sig = signingKey.sign(hashTx, "base64");

        this.signature = sig.toDER('hex');

    }

    isValid(){
        // If the transaction doesn't have a from address we assume it's a
        // mining reward and that it's valid. You could verify this in a
        // different way (special field for instance)
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No Signature in this Transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress,'hex');

        return publicKey.verify(this.generateHashes(), this.signature)
    }
}


//create a JavaScript class to represent a Block
class Block {
    //constructor(index, timestamp,data,previousHash){
    //constructor(timestamp,data,previousHash){
    constructor(timestamp,transactions,previousHash){
        this.index = 0;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.generateHash();
        this.nonce = 0;
    }

    generateHash(){
        //console.log(Base64.stringify(SHA256(this.index + this.timestamp +this.previousHash + JSON.stringify((this.data)).toString())));
        //return Base64.stringify(SHA256(this.index + this.timestamp +this.previousHash + JSON.stringify((this.data)).toString()+ this.nonce));
        return Base64.stringify(SHA256(this.index + this.timestamp +this.previousHash + JSON.stringify((this.transactions)).toString()+ this.nonce));
    }

    // Proof-Of-Work blockchain
    minBlock(difficulty){
        while(this.hash.substring(0,difficulty) != Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.generateHash();
        }
        //console.log("Block mined: "+ this.hash);
    }

    hasValidTransactions() {
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false
            }
        }
        return true;
    }
} 


class Blockchain{
    constructor(){
        this.blockchain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("30/08/2022", "first block of the chain","0");
    }

    getTheLatestBlock(){
        return this.blockchain[this.blockchain.length - 1];
    }

    // Add new Block into Block chain
    // addNewBlock(newBlock){
    //         //console.log(this.validateChainIntegrity());
    //         newBlock.index = this.getTheLatestBlock().index + 1
    //         newBlock.previousHash = this.getTheLatestBlock().hash;
    //         // newBlock.hash = newBlock.generateHash();
    //         newBlock.minBlock(this.difficulty);
    //         if(this.isValidBlock(newBlock))
    //         {
    //             this.blockchain.push(newBlock);
    //         }
    // }

    minePendingTransactions(miningRewardAddress){

        let block = new Block(Date.now(),this.pendingTransactions,this.getTheLatestBlock().hash);
        block.index = this.getTheLatestBlock().index + 1;
        block.minBlock(this.difficulty);
        //console.log("Block Successfully Mined.");
        this.blockchain.push(block);
        //console.log(this.blockchain);

        this.pendingTransactions= [
            // const rewardTx = new Transaction(miningRewardAddress,this.pendingTransactions[0].toAddress, this.miningReward)
            new Transaction(null,miningRewardAddress, this.miningReward)
        ]   
    }

    // createTransaction(transaction){
    //     this.pendingTransactions.push(transaction);
    // }

    addTransaction(transaction){
        //console.log(transaction);
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }

        // Verify the Transactiion
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0');
        }

        // Making sure that the amount sent is not greater than existing balance
        const walletBalance = this.getBalanceOfAddress(transaction.fromAddress);

        if (walletBalance < transaction.amount) {
            throw new Error('Not enough balance');
        }

        // Get all other pending transactions for the "from" wallet
        const pendingTxForWallet = this.pendingTransactions.filter((tx)=>{
            tx.fromAddress === transaction.fromAddress;
        })

        if(pendingTxForWallet.length > 0){
            const totalPendingAmount = pendingTxForWallet.map(tx => tx.amount).reduce((prev,curr)=> prev + curr);

            const totalAmount = totalPendingAmount + transaction.amount;
            if(totalAmount > walletBalance){
                throw new Error('Pending transactions for this wallet is higher than its balance.');
            }
        }
        this.pendingTransactions.push(transaction);

        //console.log(JSON.stringify(this.blockchain,null,5));
        //console.log('transactions added: %s', transaction);
        //console.log('transactions added: ', transaction);
    }


    getBalanceOfAddress(address){
        let balance = this.miningReward;
        //let balance = 100;

        //console.log(JSON.stringify(this.blockchain,null,10))
        for(const block of this.blockchain){
                for(const trans of block.transactions){
                    if(trans.toAddress == address && trans.fromAddress !=null){
                        balance += trans.amount;
                    }

                    if (trans.fromAddress === address) {
                        balance -= trans.amount;
                    }
                }
        }
        //console.log('getBalanceOfAddress: %s', balance);
        // console.log('getBalanceOfAddress: ', balance);
        return balance;
    }


    getAllTransactionsForWallet(address){
        const txs = [];
        for(const block of this.blockchain){
            for(const tx of block.transactions){
                if(tx.fromAddress === address || tx.toAddress === address) 
                {
                    txs.push(tx);
                }
            }
        }
        // console.log('get transactions for wallet count: ', txs.length);
        //console.log('total transactions for wallet: ', txs.length);
        return txs;
    }


    isValidBlock(newBlock){
        const prevBlock = this.getTheLatestBlock();
        if(newBlock.index > prevBlock.index && newBlock.previousHash === prevBlock.hash)
        {
            return true
        }
        return false
    }

    // testing the integrity of the chain
    validateChainIntegrity(){
            //console.log("length",this.blockchain.length);
            const realGenesis = JSON.stringify(this.createGenesisBlock());

            if (realGenesis !== JSON.stringify(this.blockchain[0])) {
              return false;
            }

            let count = 0;
            const length = this.blockchain.length -1;
            for(let i = 1; i<this.blockchain.length; i++){
                const currentBlock = this.blockchain[i];
                const previousBlock = this.blockchain[i-1];
                //console.log("curr",currentBlock);
                //console.log("prev",previousBlock);


                if (!currentBlock.hasValidTransactions()) {
                    return false;
                }

                if (previousBlock.hash !== currentBlock.previousHash) {
                    return false;
                }
                //console.log(currentBlock);
                //console.log(currentBlock.hash);
                //console.log(currentBlock.generateHash());
                if(currentBlock.hash !== currentBlock.generateHash()){
                    return false;
                }

                count++;
                
                if(count === length){
                    return true;
                }
            }
    }
}


module.exports = {Blockchain,Transaction,Block}