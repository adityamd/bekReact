import React from 'react'

import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

import DefaultAppBar from './AppBar'

class Layout extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <div>
                <DefaultAppBar heading={this.props.AppBarHeading} child={this.props.AppBarChild} />
                <Typography variant="h2" align="center" color="textPrimary" className="heading">
                    {this.props.heading}
                </Typography>
                    {this.props.children}
            </div>
        );
    }
}

export default Layout;