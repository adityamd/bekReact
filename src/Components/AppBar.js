import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PersonOutlineTwoToneIcon from '@material-ui/icons/PersonOutlineTwoTone';
import Cookies from 'universal-cookie';
import axios from "axios";

import './Styles/AppBar.css'

class DefaultAppBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            heading: this.props.heading,
            menuState: false,
            MenuAnchor: null,
            drawerState: false
        };
        this.profileClicked = this.profileClicked.bind(this);
        this.profileClosed = this.profileClosed.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout(e){
        let cookie = new Cookies();
        let s= cookie.get("AuthToken");
        axios.get('https://bharatekkhoj.herokuapp.com/api/auth/logout',{
            headers:{
                "Authorization": "Token "+s
            }
        }).then(res => {console.log(res)});
        cookie.remove("AuthToken");
    }

    profileClosed(e) {
        this.setState({
            menuState: false,
            MenuAnchor: null
        });
    }

    profileClicked(e) {
        this.setState({
            menuState: true,
            MenuAnchor: e.currentTarget
        });
        console.log(e.currentTarget);
    }

    render() {
        return (
            <div className="root">
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h5" className="title">
                            { this.state.heading}
                        </Typography>
                        <div style={{ position: "fixed", right: 100, display: "flex" }}>
                            {this.props.child}
                            <Button className="profile" color="inherit" onClick={this.profileClicked}>
                                <PersonOutlineTwoToneIcon/>
                            </Button>
                        </div>
                        <Menu open={this.state.menuState} anchorEl={this.state.MenuAnchor} onClose={this.profileClosed}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                            <MenuItem onClick={this.logout}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default DefaultAppBar;
