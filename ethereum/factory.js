import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x400171E02fCd10A56525F68d68589d711d1A6Ec6'
    );

export default instance;
