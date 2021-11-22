import React from 'react';
import { Header, Icon, Menu, Container } from 'semantic-ui-react';
import {Link} from '../routes';

import WalletConnect from './WalletConnect';

export default (props) => {
    return (
        <Container style={{marginTop: '10px'}}>
            <WalletConnect />
            <Header
            as='h1'
            textAlign='left'
            size='huge'>
                <Icon name='kickstarter'></Icon>
                KICKSTART
            </Header>

            <Menu>
                <Link route='/'>
                    <a className='item'> Home </a>
                </Link>
                <Menu.Menu position='right'>
                    <Link route='/campaigns/new'>
                        <a className='item'>
                            +
                        </a>
                    </Link>
                </Menu.Menu>
            </Menu>

            {props.children}

        </Container>
    )
}