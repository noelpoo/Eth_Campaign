import React, {Component} from 'react';
import web3 from '../ethereum/web3'
import {Table, Button, Message} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {

    static async getInitialProps(){
        return {};
    }

    constructor(props) {
        super(props);
        this.state = {
            approveLoading: false,
            approveComplete: false,
            finalizeLoading: false,
            finalizeComplete: false,
            approvalError: '',
            finalizeError: ''
        }
    }

    onApprove = async(event) => {
        event.preventDefault();
        try{
            this.setState({ approveLoading: true, approvalError: ''})
            const campaign = Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            })
            this.setState({ approveLoading: false })
        } catch (err){
            console.log(err.message);
            this.setState({approveLoading: false, approvalError: err.message})
        }
    }

    onFinalize = async(event) => {
        event.preventDefault();
        try {
            this.setState({ finalizeLoading: true, finalizeError: ''});
            const campaign = Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            })
            this.setState({ finalizeLoading: false });
        } catch(err) {
            this.setState({ finalizeLoading: false, finalizeError: err.message});
        }
    }


    render() {
        const {Row, Cell} = Table;
        const completed = this.props.request.complete ? 'Yes' : 'No';
        return (
            <Row>
                <Cell>
                    {this.props.id + 1}
                </Cell>
                <Cell>{this.props.request.description}</Cell>
                <Cell>{web3.utils.fromWei(this.props.request.value, 'ether')}</Cell>
                <Cell>{this.props.request.recipient}</Cell>
                <Cell>{this.props.request.approvalCount}/{this.props.approverCount}</Cell>
                <Cell>{completed}</Cell>
                <Cell error={!!this.state.error}>
                    <Button color='green' basic content='Approve' 
                    loading={this.state.approveLoading} 
                    onClick={event => this.onApprove(event)}></Button>
                    <Message error content={this.state.approvalError}></Message>
                </Cell>
                <Cell>
                    <Button color='red' basic content='Finalize'
                    loading={this.state.finalizeLoading}
                    onClick={event => this.onFinalize(event)}></Button>
                    <Message error content={this.state.finalizeError}></Message>
                </Cell>
            </Row>
        )
    }
}

export default RequestRow;
