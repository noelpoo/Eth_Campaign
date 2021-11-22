import React, { Component } from 'react';
import factory from '../ethereum/factory';
import 'semantic-ui-css/semantic.min.css'

import CampaignList from '../components/CampaignList';
import Layout from '../components/Layout';
import CreateCampaignButton from '../components/CreateCampaign';


class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns: campaigns };
    }

    constructor(props) {
        super(props);
        this.state = {
            campaigns: []
        }
    }

    async componentDidMount() {
        console.log(`campaigns: ${this.props.campaigns.length}`);
        this.setState({ campaigns: this.props.campaigns });
    }

    render() {
        return (
            <Layout>
                <div>
                    <div>
                        <h3 style={{marginTop: '40px'}}>
                            Open Campaigns ({this.state.campaigns.length})
                        </h3>
                        <CreateCampaignButton />
                        <CampaignList />
                    </div>
                </div>
            </Layout>
        )
    }
}

export default CampaignIndex;
