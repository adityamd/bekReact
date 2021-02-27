import React from 'react'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { ListItemSecondaryAction} from '@material-ui/core';

class Review extends React.Component {

    render() {
        return (
            <ListItem  dense divider>
                <ListItemSecondaryAction>
                    {this.props.secondaryText}
                </ListItemSecondaryAction>
                <ListItemText primary={this.props.heading} secondary={this.props.text} />
            </ListItem>
        );
    }
}

export default Review;