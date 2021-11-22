import React, { Component } from 'react';
import { Header, Form, Button, Input, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import { Router } from '../../routes';

import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';

class CampaignNew extends Component {

    constructor(props){
        super(props);
        this.state = {
            minumumContribution: '',
            connectedAccount: '',
            errorMessage: '',
            loading: false,
            completed: false
        }
    }

    async componentDidMount() {
        try{
            const accounts = await web3.eth.getAccounts()
            this.setState({connectedAccount: accounts[0]});
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
    }

    onSubmit = async (event) => {
        event.preventDefault();
        try {
            this.setState({
                errorMessage: '',
                loading: true,
                completed: false
            });
            await factory.methods.createCampaign(this.state.minumumContribution).send({
                from: this.state.connectedAccount
            })
            this.setState({
                loading: false,
                completed: true
            })
            Router.pushRoute('/');
        } catch (err) {
            console.log(`error: ${err.message}`);   
            this.setState({
                errorMessage: err.message,
                loading: false
            });
        }
    }

    render() {
        return(
            <Layout>

                <Header as='h2' size='medium' style={{marginTop: '40px'}}>
                    Create a new campaign
                </Header>

                <Form onSubmit={this.onSubmit}
                 error={!!this.state.errorMessage}
                 warning={this.state.completed}>

                    <Form.Field>
                        <label>Minimum Contribution (wei)</label>

                        <Input 
                        label='wei'
                        labelPosition='right'
                        placeholder='0'
                        value={this.state.minumumContribution}
                        onChange={event => this.setState({minumumContribution: event.target.value})} />

                        <Button 
                        loading={this.state.loading} 
                        style={{marginTop: '5px'}}
                        content='Create Campaign'
                        primary />

                    </Form.Field>
                    <Message error header="Transaction error!" content={this.state.errorMessage}></Message>
                    <Message warning content="Campaign has been created"></Message>
                </Form>

            </Layout>
        )
    }
}

export default CampaignNew;
