import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            loading: false,
            completed: false,
            errorMessage: '',
            connectedAccount: ''
        }
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);

        try {
            this.setState({
                errorMessage: '',
                loading: true,
                completed: false
            })
            const accounts = await web3.eth.getAccounts();
            this.setState({ connectedAccount: accounts });
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            })
            this.setState({
                loading: false,
                completed: true
            })
        } catch (err) {
            this.setState({
                errorMessage: err.message,
                loading: false
            })
        }
    }

    render() {
        return (
            <Form error={!!this.state.errorMessage} warning={this.state.completed} onSubmit={this.onSubmit}>
                <Form.Field>
                    <label>
                        Amount to contribute
                    </label>
                    <Input
                        value={this.state.value}
                        onChange={(event) => this.setState({ value: event.target.value })}
                        label="ether"
                        labelPosition='right'
                    />
                </Form.Field>
                <Message error header="Transaction error!" content={this.state.errorMessage} />
                <Message warning content="Contribution transacted, please refresh the page" />
                <Button primary loading={this.state.loading} content='Contribute' />
            </Form>
        )
    }
}

export default ContributeForm;
