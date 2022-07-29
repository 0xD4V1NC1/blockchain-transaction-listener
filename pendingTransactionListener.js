const Web3 = require('web3');

class TransactionChecker {
    web3;
    web3ws;
    account;
    subscription;

    constructor(account) {
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider(`wss://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_SPEEDY_NODE_ID}/polygon/mainnet/ws`));
        this.web3 = new Web3(new Web3.providers.HttpProvider(`https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_SPEEDY_NODE_ID}/polygon/mainnet`));
        this.account = account.toLowerCase();
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) console.error(err);
        });
    }

    watchTransactions() {
        console.log('Watching all pending transactions...');
        this.subscription.on('data', (txHash) => {
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash);
                    if (tx != null) {
                        if (this.account == tx.to.toLowerCase()) {
                            console.log({address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }, 60000)
        });
    }
}

let txChecker = new TransactionChecker(`${process.env.ADDRESS_TO_WATCH}`);
txChecker.subscribe('pendingTransactions');
txChecker.watchTransactions();
