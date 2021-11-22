import React, { Component } from 'react';
import Campaign from '../../../ethereum/campaign';
import {Button, Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import 'semantic-ui-css/semantic.min.css'

class RequestIndex extends Component {

    constructor(props) {
        super(props);
    }

    static async getInitialProps(props) {
        const address = props.query.address;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestCount().call(); 
        const summary = await campaign.methods.getSummary().call();
        const approverCount = summary['3'];
        // let requests = [];
        // for (let i = 0; i < requestCount; i ++) {
        //     const request = await campaign.methods.requests(i).call();
        //     requests.push(request);
        // }
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        )

        return {address: address, requests: requests, requestCount: requestCount, approverCount: approverCount};
    }

    renderRow() {
        return this.props.requests.map((request, index) => {
            return(
                <RequestRow
                request={request}
                key={index}
                id={index}
                address={this.props.address}
                approverCount={this.props.approverCount}
                >
                </RequestRow>
            )
        })
    }


    render() {
        const {Header, Row, HeaderCell, Body} = Table;

        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}`}>
                    <a>
                        Back
                    </a>
                </Link>
                <h3>
                    request list for campaign
                </h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary content='Create new request' />
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount (Ether)</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Completed</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderRow()}</Body>
                </Table>
            </Layout>
        )
    }
}

export default RequestIndex;
