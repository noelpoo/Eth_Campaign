const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('../ethereum/build/CampaignFactory.json')

let contract;

export const infura = {
    account_mnemonic: 'wash exercise isolate since behave divorce pear system lamp small water rabbit',
    endpoints: {
        rinkeby: 'https://rinkeby.infura.io/v3/023a9858cbba44b69d73919b72d1006b',
        ropstein: 'https://ropsten.infura.io/v3/6d597dc42f2a42809aadc9cd98acfe08'
    }
}

const provider = new HDWalletProvider(
    infura.account_mnemonic,
    infura.endpoints.ropstein
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0] || null;
    console.log(`Account: ${account}`);
    try {
        contract = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: account, gas: '1000000', gasPrice: '5000000000' })
    } catch(err) {
        console.log(err);
    }
    console.log(compiledFactory.interface);
    console.log(`Factory Contract Address: ${contract.options.address}`);
}

// deploy();
