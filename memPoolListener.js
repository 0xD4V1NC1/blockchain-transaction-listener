// Load environment variables
require('dotenv').config();
const open = require('open');
// hi ST
// Connect to Ethereum node
const Web3 = require('web3')
const nodeURL = `wss://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_SPEEDY_NODE_ID}/${process.env.BLOCKCHAIN}/mainnet/ws`
const provider = new Web3.providers.WebsocketProvider(nodeURL);
const web3 = new Web3(provider);

const account = `${process.env.ADDRESS_TO_WATCH.toLowerCase()}`;
const account2 = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
const avax='0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664';
const subscription = web3.eth.subscribe('pendingTransactions', (err, res) => {
    if (err) console.error(err);
});
console.log(`Currently listening to: ${process.env.ADDRESS_TO_WATCH} ...`);

subscription.on('data', (txHash) => {
    setTimeout(async () => {

        try {
            let tx = await web3.eth.getTransaction(txHash);
            if (tx && tx.to) { // This is the point you might be looking for to filter the address
                if (tx.to.toLowerCase() === account) {
                    console.log('TX hash: ', txHash); // transaction hash
                    console.log('TX confirmation: ', tx.transactionIndex); // "null" when transaction is pending
                    console.log('TX nonce: ', tx.nonce); // number of transactions made by the sender prior to this one
                    console.log('TX block hash: ', tx.blockHash); // hash of the block where this transaction was in. "null" when transaction is pending
                    console.log('TX block number: ', tx.blockNumber); // number of the block where this transaction was in. "null" when transaction is pending
                    console.log('TX sender address: ', tx.from); // address of the sender
                    console.log('TX amount(in Ether): ', web3.utils.fromWei(tx.value, 'ether')); // value transferred in ether
                    console.log('TX date: ', new Date()); // transaction date
                    console.log('TX gas price: ', tx.gasPrice); // gas price provided by the sender in wei
                    console.log('TX gas: ', tx.gas); // gas provided by the sender.
                    console.log('TX input: ', tx.input); // the data sent along with the transaction.
                    console.log('=====================================') // a visual separator
                }
            }
        } catch (err) {
            console.error(err);
        }
   }, 5000)
});