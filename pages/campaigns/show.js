import React, { Component } from 'react';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import { Card, Grid, Button, List } from 'semantic-ui-react';
import { Link } from '../../routes';
import 'semantic-ui-css/semantic.min.css'

import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';

class CampaignShow extends Component {
    constructor(props) {
        super(props);
    }

    static async getInitialProps(props) {
        const campaignAddress = props.query.address;
        const campaign = Campaign(campaignAddress);
        const summary = await campaign.methods.getSummary().call();
        const approverList = await campaign.methods.getApproverAddresses().call();
        return {
            minContribution: summary['0'],
            totalFunds: summary['1'],
            requestCount: summary['2'],
            contributerCount: summary['3'],
            manager: summary['4'],
            address: campaignAddress,
            approverList: approverList
        };
    }

    renderApproverList() {
        return (
            <div>
                <List.Header>Contributers</List.Header>
                <List bulleted items={this.props.approverList}></List>
            </div>
        )
    }

    render() {
        const items = [
            {
                header: this.props.manager,
                description: 'Campaign manager can create and finalize payment requests',
                meta: 'Address of campaign manager',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(this.props.totalFunds, 'ether'),
                description: 'Total contributions',
                meta: 'Amount in Ether',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.requestCount,
                description: 'Pending request count',
                meta: 'Requests',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.contributerCount,
                description: 'Total number of contributors in this campaign',
                meta: 'Contributors',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(this.props.minContribution, 'ether'),
                description: 'Minimum contribution to be a contributor in this campaign',
                meta: 'Amount in Ether',
                style: { overflowWrap: 'break-word' }
            },
            {
                description: this.renderApproverList(),
                style: { overflowWrap: 'break-word' }
            }
        ]

        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            <Card.Group items={items} />
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>
                                        View requests
                                    </Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    }
}

export default CampaignShow;
