import React, { Component } from 'react';
import web3 from '../ethereum/web3';
import { Button } from 'semantic-ui-react';

class WalletConnect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectedAccount: [],
            enabled: true
        }
    }

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        !accounts || this.setState({
            connectedAccount: accounts,
            enable: false,
        });
    }

    render() {
        return (
            <div>
                <Button disabled={!this.state.enabled}
                inverted color='orange' 
                size='tiny'
                onClick={event => this.onConnect(event)}>
                    Connect to metamask
                </Button>
                <div>
                    Please connect to Ropstein testnet
                </div>
            </div>
        )
    }

    async onConnect(event) {
        event.preventDefault();
        await web3.currentProvider.enable();
        const accounts = await web3.eth.getAccounts();
        !accounts || this.setState({ 
            connectedAccount: accounts,
            enabled: false
        });
    }
}

export default WalletConnect;
