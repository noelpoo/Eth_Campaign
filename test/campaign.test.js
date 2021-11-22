const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;
let manager;

const minContribution = '100';

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    manager = accounts[0];
    try {
        factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000', gasPrice: '5000000000' });
    } catch (error) {
        console.log(`error: ${error}`);
    }
    await factory.methods.createCampaign(minContribution).send(
        {
            from: accounts[0],
            gas: '1000000',
            gasPrice: '5000000000'
        }
    )

    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0] || null;
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    )
})

describe('Campaign Test', () => {

    it('deploy Campaign factory', () => {
        assert.ok(factory.options.address);
    })

    it('deploy Campaign', () => {
        assert.ok(campaign.options.address);
    })

    it('Campaign manager is user address', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    })

    it('Factory deploys new campaign contract', async() => {
        await factory.methods.createCampaign('100').send({
            from: accounts[0],
            gas: '1000000',
            gasPrice: '5000000000'
        })
        const deployedAddresses = await factory.methods.getDeployedCampaigns().call();
        assert(deployedAddresses.length > 1);
    })

    it('User contributes below minimum to campaign', async() => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                gas: '1000000',
                gasPrice: '5000000000',
                value: '50'
            })
        } catch (err) {
            assert(err);
        }
        const user = await campaign.methods.approvers(accounts[1]).call();
        assert(!user);
        const totalFunds = await campaign.methods.totalFunds().call();
        assert.equal(totalFunds, 0);
    })

    it('User contributes above minimum to campaign', async() => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            gas: '1000000',
            gasPrice: '5000000000',
            value: '500'
        });
        const user = await campaign.methods.approvers(accounts[1]).call();
        assert(user);
        const totalFunds = await campaign.methods.totalFunds().call();
        assert.equal(totalFunds, 500);
    })

    it('get approver addresses', async() => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            gas: '1000000',
            gasPrice: '5000000000',
            value: '500'
        })
        await campaign.methods.contribute().send({
            from: accounts[2],
            gas: '1000000',
            gasPrice: '5000000000',
            value: '500'
        })
        const approversAddresses = await campaign.methods.getApproverAddresses().call();
        assert.equal(approversAddresses.length, 2);
    })

    it('Manager creates request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            gas: '1000000',
            gasPrice: '5000000000',
            value: '500'
        })
        await campaign.methods.createRequest('Send money to me', '100', manager).send({
            from: manager,
            gas: '1000000',
            gasPrice: '5000000000'
        })
        const request = await campaign.methods.requests(0).call();
        assert.ok(request);
    })

    it('Approver approves request', async() => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            gas: '1000000',
            gasPrice: '5000000000',
            value: '500'
        })
        await campaign.methods.createRequest('Send money to me', '100', manager).send({
            from: manager,
            gas: '1000000',
            gasPrice: '5000000000'
        })
        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000',
            gasPrice: '5000000000',
        })
        const request = await campaign.methods.requests(0).call();
        assert.equal(request.approvalCount, '1');
    })

    it('Non-approver approves request', async() => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            gas: '1000000',
            gasPrice: '5000000000',
            value: '500'
        })
        await campaign.methods.createRequest('Send money to me', '100', manager).send({
            from: manager,
            gas: '1000000',
            gasPrice: '5000000000'
        })

        try {
            await campaign.methods.approveRequest(0).send({
                from: accounts[2],
                gas: '1000000',
                gasPrice: '5000000000',
            })
        } catch(err) {
            assert(err);
        }
        const request = await campaign.methods.requests(0).call();
        assert.equal(request.approvalCount, '0');
    })

    it('Non-manager finalize request', async() => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            gas: '1000000',
            gasPrice: '5000000000',
            value: '500'
        })
        await campaign.methods.createRequest('Send money to me', '100', manager).send({
            from: manager,
            gas: '1000000',
            gasPrice: '5000000000'
        })
        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000',
            gasPrice: '5000000000',
        })

        try {
            await campaign.methods.finalizeRequest(0).send({
                from: accounts[1],
                gas: '1000000',
                gasPrice: '5000000000'
            })
        } catch (err) {
            assert(err);
        }
        const request = await campaign.methods.requests(0).call();
        assert(!request.complete);
    })

    it('manager finalize request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            gas: '1000000',
            gasPrice: '5000000000',
            value: '500'
        })
        await campaign.methods.createRequest('Send money to me', '100', manager).send({
            from: manager,
            gas: '1000000',
            gasPrice: '5000000000'
        })
        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000',
            gasPrice: '5000000000',
        })

        try {
            await campaign.methods.finalizeRequest(0).send({
                from: manager,
                gas: '1000000',
                gasPrice: '5000000000'
            })
        } catch (err) {
            assert(err);
        }
        const request = await campaign.methods.requests(0).call();
        assert(request.complete);
    })
})
