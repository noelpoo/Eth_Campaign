import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from '../routes';

class CreateCampaignButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Link route='/campaigns/new'>
                <a className='create button'>
                    <Button
                        content='Create Campaign'
                        icon='add circle'
                        floated='right'
                        primary
                    />
                </a>
            </Link>
        )
    }
}

export default CreateCampaignButton
