import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3';

import Layout from '../../../components/Layout';
import { Form, Message, Button, Input, Header, Grid } from 'semantic-ui-react'
import { Link } from '../../../routes';
import { Router } from 'next/router';

class NewRequest extends Component {

    static async getInitialProps(props) {
        const address = props.query.address;
        return {
            address: address
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            description: '',
            amount: '',
            recipient: '',
            loading: false,
            completed: false,
            errorMessage: ''
        }
    }

    onSubmit = async (event) => {
        event.preventDefault();
        try {
            this.setState({
                loading: true,
                completed: false,
                errorMessage: ''
            })
            const accounts = await web3.eth.getAccounts()
            const campaign = Campaign(this.props.address);
            await campaign.methods.createRequest(
                this.state.description,
                web3.utils.toWei(this.state.amount, 'ether'),
                this.state.recipient
            ).send({ from: accounts[0] })
            this.setState({ loading: false, completed: true });
            Router.pushRoute(`/campaigns/${this.props.address}`);
        } catch (err) {
            console.log(`error: ${err.message}`);
            this.setState({ errorMessage: err.message, loading: false });
        }
    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        Back
                    </a>
                </Link>
                <Grid style={{marginTop: '10px'}}>
                    <Grid.Column width={10}>
                        <Header as='h2' size='medium' style={{ marginTop: '5px' }}>
                            Create Request
                        </Header>
                        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} warning={this.state.completed}>
                            <Form.Field>
                                <Input
                                    style={{ marginTop: '10px' }}
                                    label='Description'
                                    labelPosition='left'
                                    value={this.state.description}
                                    onChange={event => this.setState({ description: event.target.value })}
                                />

                                <Input
                                    style={{ marginTop: '10px' }}
                                    label='Amount in Ether'
                                    labelPosition='left'
                                    value={this.state.amount}
                                    onChange={event => this.setState({ amount: event.target.value })}
                                />

                                <Input
                                    style={{ marginTop: '10px' }}
                                    label='Recipient'
                                    labelPosition='left'
                                    value={this.state.recipient}
                                    onChange={event => this.setState({ recipient: event.target.value })}
                                />

                                <Button
                                    content='Create request'
                                    primary
                                    loading={this.state.loading}
                                    style={{ marginTop: '10px' }} />
                            </Form.Field>
                            <Message error header='Transaction error!' content={this.state.errorMessage}></Message>
                            <Message warning content="Request has been created!"></Message>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={5}>
                    </Grid.Column>
                </Grid>
            </Layout>
        )
    }
}

export default NewRequest;
