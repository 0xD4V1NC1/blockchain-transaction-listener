const Web3 = require('web3');

class TransactionChecker {
    web3;
    account;

    constructor(account) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(`https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_SPEEDY_NODE_ID}/${process.env.BLOCKCHAIN}/mainnet`));
        this.account = account.toLowerCase();
    }

    async checkBlock() {
        let block = await this.web3.eth.getBlock('latest');
        let number = block.number;
        console.log('Searching block ' + number);

        if (block != null && block.transactions != null) {
            for (let txHash of block.transactions) {
                let tx = await this.web3.eth.getTransaction(txHash);
                if (this.account == tx.to.toLowerCase()) {
                    console.log('Transaction found on block: ' + number);
                    console.log({address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});
                }
            }
        }
    }
}

let txChecker = new TransactionChecker(`${process.env.ADDRESS_TO_WATCH}`);
setInterval(() => {
    txChecker.checkBlock();
}, 5000);
