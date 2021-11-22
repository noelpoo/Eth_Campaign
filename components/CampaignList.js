import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card } from 'semantic-ui-react';
import { Link } from '../routes';

class CampaignList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campaigns: []
        }
    }

    async componentDidMount() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        const items = campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a className='view campaign'>
                            View campaign
                        </a>
                    </Link>
                ),
                fluid: true
            }
        })
        this.setState({ campaigns: items });
    }

    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <Card.Group
                    centered
                    items={this.state.campaigns} />
            </div>
        )
    }
}

export default CampaignList;
