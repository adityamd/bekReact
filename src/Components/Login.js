import React from 'react'
import axios from 'axios'

import { Container,Button, Tab, Tabs,TextField,Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'


class LoginSignup extends React.Component {
    constructor(props) {
        super(props);

        this.state = ({
            tabValue: "Reader",
            unameReader: "",
            pwdReader: "",
            unamePublisher: "",
            pwdPublisher: "",
            emailReader: "",
            emailPublisher: "",
            accountPresent: true
        });
        this.handleTabChange = this.handleTabChange.bind(this);
        this.unameChanged = this.unameChanged.bind(this);
        this.passwrdChanged = this.passwrdChanged.bind(this);
        this.unameChanged_ = this.unameChanged_.bind(this);
        this.passwrdChanged_ = this.passwrdChanged_.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.loginButtonClicked = this.loginButtonClicked.bind(this);
        this.emailChanged_ = this.emailChanged_.bind(this);
        this.emailChanged = this.emailChanged.bind(this);
    }

    handleTabChange(e, val) {
        this.setState({
            tabValue: val
        });
    }

    createAccount(e) {
        this.setState({
            unameReader: "",
            pwdReader: "",
            unamePublisher: "",
            pwdPublisher: "",
            emailReader: "",
            emailPublisher: ""
        })
        if (this.state.accountPresent) {
            this.setState({
                accountPresent: false
            });
        }
        else {
            this.setState({
                accountPresent: true
            });
        }
    }

    loginButtonClicked(e){
        if(this.state.accountPresent){
            if(this.state.tabValue==="Reader"){
                axios.post(`https://bharatekkhoj.herokuapp.com/api/auth/login`,{
                    "username":this.state.unameReader,
                    "password":this.state.pwdReader
                }).then(res => 
                    {   
                        axios.get(`https://bharatekkhoj.herokuapp.com/api/users/reader/${this.state.unameReader}/`).then(res => {
                            console.log(res.data)
                            if(res.data === 1){
                                alert("Login Successful");
                            }
                            else{
                                alert("Login Unsuccessful");
                            }
                        });
                    }).catch(() => alert("Login is Unsuccessful"));
            }
            else if(this.state.tabValue==="Publisher"){
                axios.post(`https://bharatekkhoj.herokuapp.com/api/auth/login`,{
                    "username":this.state.unamePublisher,
                    "password":this.state.pwdPublisher
                }).then(res => 
                    {   axios.get(`https://bharatekkhoj.herokuapp.com/api/users/reader/${this.state.unamePublisher}`).then(res => {
                            if(res.data.Reader === false){
                                alert("Login Successful");
                            }
                            else{
                                alert("Login Unsuccessful");
                            }
                        })
                    }).catch(() =>  alert("Login Unsuccessful"));
            }
        }

        else{
            if(this.state.tabValue==="Reader"){
                axios.post(`https://bharatekkhoj.herokuapp.com/api/auth/register`,{
                    "username":this.state.unameReader,
                    "email":this.state.emailReader,
                    "password":this.state.pwdReader
                },{headers:{
                    "Access-Control-Allow-Origin":"*"
                }}).then(
                    res => {
                        console.log("HEREE");
                    axios.post(`https://bharatekkhoj.herokuapp.com/api/users/add`,{
                            "uname":this.state.unameReader,
                            "passwd": this.state.pwdReader,
                            "Reader": true
                        },{headers:{
                            "Access-Control-Allow-Origin":"*"
                        }}).then(alert("User Registered")).catch(()=>alert("User Not registered"))
                        
                    }).catch(() => alert("Registration Unsuccessful"));
            }
            else if(this.state.tabValue==="Publisher"){
                axios.post(`https://bharatekkhoj.herokuapp.com/api/auth/register`,{
                    "username":this.state.unameReader,
                    "email":this.state.emailPublisher,
                    "password":this.state.pwdReader
                }).then( axios.post(`https://bharatekkhoj.herokuapp.com/api/users/add`,{
                            "uname":this.state.unameReader,
                            "passwd": this.state.pwdReader,
                            "Reader": false
                        }).then(alert("User Registered")).catch(()=>alert("User Not registered"))                        
                    ).catch(() => alert("Registration Unsuccessful"));
            }
        }


    }

    unameChanged_(e) {
        this.setState({
            unameReader: e.target.value
        });
    }

    passwrdChanged_(e) {
        this.setState({
            pwdReader: e.target.value
        });
    }

    unameChanged(e) {
        this.setState({
            unamePublisher: e.target.value
        });
    }

    passwrdChanged(e) {
        this.setState({
            pwdPublisher: e.target.value
        });
    }

    emailChanged_(e){
        this.setState({
            emailReader: e.target.value
        })
    }

    emailChanged(e){
        this.setState({
            emailPublisher: e.target.value
        })
    }

    render() {
        return (
            <div>
                <Container style={{ padding: 100, margin: 100 }}>

                    <AppBar position="fixed">
                        <Toolbar>
                            <Typography variant="h5" className="title">
                                Bharat Ek Khoj
                            </Typography>
                            <Button onClick={this.createAccount} style={{ position: "fixed", right: 20, color: "white" }}>
                                {(this.state.accountPresent)?"Create An Account":"Login"}
                            </Button>

                        </Toolbar>
                    </AppBar>
                    <Tabs centered value={this.state.tabValue} onChange={this.handleTabChange}>
                        <Tab value={"Reader"} label="Reader" />
                        <Tab value={"Publisher"} label="Publisher" />
                    </Tabs>
                    {
                        this.state.tabValue === "Reader" && (
                            <div style={{ marginTop: 30 }}>
                                <TextField onChange={this.unameChanged_} autoFocus
                                        label="Username" placeholder={"Username"} value={this.state.unameReader}/>
                                <br /><br />
                                {  (this.state.accountPresent)?(<div />):(
                                    <div>
                                        <TextField onChange={this.emailChanged_} 
                                                label="Email ID" placeholder={"Email ID"} value={this.state.emailReader}/>
                                        <br /><br />
                                    </div>
                                    )
                                }
                                <TextField onChange={this.passwrdChanged_}
                                    label="Password" placeholder={"Password"} type="password" value={this.state.pwdReader}/>
                                <br /><br />
                                <Typography variant="body2" color="textSecondary" style={{ marginBottom: 10 }}>
                                    Note: {(this.state.accountPresent) ? "Signing in" : "Registering"} as Reader
                                </Typography>
                                <Button color="primary" variant="contained" onClick={this.loginButtonClicked}>
                                    {(this.state.accountPresent) ? "Login" : "Register"}
                                </Button>
                            </div>
                        )
                    }
                    {
                        this.state.tabValue === 'Publisher' && (
                            <div style={{ marginTop: 30 }}>
                                <TextField onChange={this.unameChanged} autoFocus
                                    label="Username" placeholder={"Username"} value={this.state.unamePublisher}/>
                                <br /><br />
                                {  (this.state.accountPresent)?(<div />):(
                                    <div>
                                        <TextField onChange={this.emailChanged} 
                                                label="Email ID" placeholder={"Email ID"} value={this.state.emailPublisher}/>
                                        <br /><br />
                                    </div>
                                    )
                                }
                                <TextField onChange={this.passwrdChanged}
                                    label="Password" placeholder={"Password"} type="password" value={this.state.pwdPublisher}/>
                                <br /><br />
                                <Typography variant="body2" color="textSecondary" style={{ marginBottom: 10 }}>
                                    Note: {(this.state.accountPresent)?"Signing in":"Registering"} as Publisher
                                </Typography>
                                <Button color="primary" variant="contained" onClick={this.loginButtonClicked}>
                                    {(this.state.accountPresent) ? "Login" : "Register"}
                                </Button>
                            </div>
                        )
                    }
                </Container>
            </div>
        );
    }
}

export default LoginSignup;