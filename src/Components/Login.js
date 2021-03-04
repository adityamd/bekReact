import React from 'react'
import axios from 'axios'
import {BrowserRouter as Router, Redirect} from "react-router-dom"
import Cookies from "universal-cookie";

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
            userExists:"",
            isLogged: false,
            accountPresent: true,
            userRegistered: false,
            password2Publisher: "",
            password2Reader: "",
            passwordMatchingReader: "",
            passwordMatchingPublisher: "",
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
        this.password2Changed = this.password2Changed.bind(this);
        this.password2Changed_ = this.password2Changed_.bind(this);
    }

    handleTabChange(e, val) {
        this.setState({
            tabValue: val,
            unameReader: "",
            pwdReader: "",
            unamePublisher: "",
            pwdPublisher: "",
            emailReader: "",
            emailPublisher: "",
            userExists:"",
            password2Publisher: "",
            password2Reader: "",
            passwordMatchingReader: "",
            passwordMatchingPublisher: "",
        });
    }

    password2Changed_(e,val){
        this.setState({
            password2Reader: e.target.value,
        });
    }

    password2Changed(e, val){
        this.setState({
            password2Publisher: e.target.value
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
                accountPresent: false,
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
                this.setState({
                    userExists: ""
                });
                axios.post(`https://bharatekkhoj.herokuapp.com/auth/dj-rest-auth/login/`,{
                    "username":this.state.unameReader,
                    "password":this.state.pwdReader
                }).then(res => 
                    {   let dt = res.data
                        let at = res.data["access_token"]
                        axios.post(`https://bharatekkhoj.herokuapp.com/api-token-auth/`,{
                        "username":this.state.unameReader,
                        "password":this.state.pwdReader
                        }).then(res=>{
                            let cookie = new Cookies();
                            let s = res.data.token;
                            console.log(dt.user.username);
                            cookie.set("BackendToken",s)
                            cookie.set("username",dt.user.username);
                            console.log("Successfully Recieved Backend Token");
                        console.log(res.data);
                        console.log(cookie.get("BackendToken"));
                        axios.get(`https://bharatekkhoj.herokuapp.com/api/users/reader/${this.state.unameReader}/`,{
                            headers:{
                                "Content-Type": "application/json",
                                "Authorization": "Token "+ cookie.get("BackendToken")
                            }
                        }).then(res => {
                            if(res.data === 1){
                                let cookie = new Cookies();
                                cookie.set("AuthToken",at);
                                console.log(at);
                                this.props.targetUsername(this.state.unameReader);
                                this.setState({
                                    isLogged: true
                                });
                                console.log("AUTH SUCCESSFUL");
                            }
                            else{
                                this.setState({
                                    userExists: "Incorrect username/password"
                                });
                            }
                        }).catch(res=>{
                            console.log("HERE");
                            console.log(res.response.data);
                        })}).catch(res => {
                            console.log(res);
                        })
                    }).catch(() => {
                        console.log("E");
                        this.setState({
                        userExists: "Incorrect username/password"
                    })});
            }
            else if(this.state.tabValue==="Publisher"){
                this.setState({
                    userExists: ""
                });
                axios.post(`https://bharatekkhoj.herokuapp.com/auth/dj-rest-auth/login/`,{
                    "username":this.state.unamePublisher,
                    "password":this.state.pwdPublisher
                }).then(res => 
                    {   let dt = res.data
                        let at = res.data["access_token"]
                        axios.post(`https://bharatekkhoj.herokuapp.com/api-token-auth/`,{
                        "username":this.state.unamePublisher,
                        "password":this.state.pwdPublisher
                        }).then(res=>{
                            let cookie = new Cookies();
                            let s = res.data.token;
                            console.log(s);
                            cookie.remove("BackendToken");
                            console.log(cookie);
                            cookie.set("BackendToken",s)
                            cookie.set("username",dt.user.username);
                            console.log(cookie);
                            console.log("Successfully Recieved Backend Token");
                        console.log(res.data);
                        console.log(cookie);
                        console.log(cookie.get("BackendToken"));
                        axios.get(`https://bharatekkhoj.herokuapp.com/api/users/reader/${this.state.unamePublisher}/`,{
                            headers:{
                                "Content-Type": "application/json",
                                "Authorization": "Token "+ cookie.get("BackendToken")
                            }
                        }).then(res => {
                            if(res.data === 0){
                                let cookie = new Cookies();
                                cookie.set("AuthToken",at);
                                console.log(at);
                                this.props.targetUsername(this.state.unamePublisher);
                                this.setState({
                                    isLogged: true
                                });
                                console.log("AUTH SUCCESSFUL");
                            }
                            else{
                                this.setState({
                                    userExists: "Incorrect username/password"
                                });
                            }
                        }).catch(res=>{
                            console.log("HERE");
                            console.log(res.response);
                        })}).catch(res => {
                            console.log(res);
                        })
                    }).catch(() => this.setState({
                        userExists: "Incorrect username/password"
                    }));
            }
        }

        else{
            if(this.state.tabValue==="Reader"){
                this.setState({
                    userExists: ""
                });
                console.log(this.state.unameReader + " " + this.state.emailReader + this.state.pwdReader);
                axios.post(`https://bharatekkhoj.herokuapp.com/auth/dj-rest-auth/registration/`,{
                    username:this.state.unameReader,
                    password1:this.state.pwdReader,
                    password2:this.state.password2Reader,
                    email:this.state.emailReader
                },{
                    headers:{
                        "Content-Type": "application/json"
                    }}).then(
                    res => {
                    axios.post(`https://bharatekkhoj.herokuapp.com/api/users/add/`,{
                            uname:this.state.unameReader,
                            passwd: this.state.pwdReader,
                            Reader: true
                        }).then(res => {
                                this.setState({
                                    userExists: "",
                                    accountPresent: true,
                                    unameReader: "",
                                    pwdReader: "",
                                    unamePublisher: "",
                                    pwdPublisher: "",
                                    emailReader: "",
                                    emailPublisher: "",
                                    password2Publisher: "",
                                    password2Reader: "",
                                    passwordMatchingReader: "",
                                    passwordMatchingPublisher: "",
                                });
                            }).catch(() => this.setState({
                            userExists: "The user could not be registered"
                        }))
                        
                    }).catch(res => {
                        let s;
                        if(res.response.data.username!==undefined)
                            s=res.response.data.username
                        else if(res.response.data.password1!==undefined)
                            s=res.response.data.password1
                        else if(res.response.data.password!==undefined)
                            s=res.response.data.password
                        else if(res.response.data.email!==undefined)
                            s=res.response.data.email
                        else if(res.response.data.non_field_errors!==undefined)
                            s=res.response.data.non_field_errors[0]
                        console.log(res.response.data);
                        this.setState({
                        userExists: s
                    })});
            }
            else if(this.state.tabValue==="Publisher"){
                this.setState({
                    userExists: ""
                });
                axios.post(`https://bharatekkhoj.herokuapp.com/auth/dj-rest-auth/registration/`,{
                    username:this.state.unamePublisher,
                    password1:this.state.pwdPublisher,
                    password2: this.state.password2Publisher,
                    email:this.state.emailPublisher
                }).then( 
                    res => {
                        axios.post(`https://bharatekkhoj.herokuapp.com/api/users/add/`,{
                            "uname":this.state.unamePublisher,
                            "passwd": this.state.pwdPublisher,
                            "Reader": 0
                        }).then(res => {
                            axios.post(`https://bharatekkhoj.herokuapp.com/api/pubs/add/`,{
                                "pub_name":this.state.unamePublisher
                            }).then(res => {
                                this.setState({
                                    accountPresent: true,
                                    unameReader: "",
                                    pwdReader: "",
                                    unamePublisher: "",
                                    pwdPublisher: "",
                                    emailReader: "",
                                    emailPublisher: "",
                                    userExists:"",
                                    password2Publisher: "",
                                    password2Reader: "",
                                    passwordMatchingReader: "",
                                    passwordMatchingPublisher: "",
                                });
                        }).catch(() => this.setState({
                            userExists: "The user could not be registered"
                        }))}).catch(res => {
                            console.log(res);
                            this.setState({
                            userExists: "The user could not be registered"
                        })})                        
                    }).catch(res => {
                        let s;
                        if(res.response.data.username!==undefined)
                            s=res.response.data.username
                        else if(res.response.data.password1!==undefined)
                            s=res.response.data.password1
                        else if(res.response.data.password!==undefined)
                            s=res.response.data.password
                        else if(res.response.data.email!==undefined)
                            s=res.response.data.email
                        else if(res.response.data.non_field_errors!==undefined)
                            s=res.response.data.non_field_errors[0]
                        this.setState({
                        userExists: s
                    })});
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
                (this.state.userRegistered)?(<Redirect to='/login' />):(
                (this.state.isLogged)?((this.state.tabValue==="Reader")?(
                    <Redirect to={"/user/"+this.state.unameReader} />
                ):(<Redirect to={'/publisher/'+this.state.unamePublisher} />)):(
            <Router>
            <div>
                <Container style={{ padding: 100, margin: 100 }}>
                    <AppBar position="fixed">
                        <Toolbar>
                            <Typography variant="h5" className="title">
                                Gyaani Baba
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
                                {  (this.state.accountPresent)?(<div />):(
                                    <div>
                                        <TextField onChange={this.password2Changed_} 
                                                label="Password2" placeholder={"Confirm Password"} 
                                                type="password" value={this.state.password2Reader}/>
                                        <br />
                                        {
                                            this.state.passwordMatchingReader
                                        }
                                        <br /><br />
                                    </div>
                                    )
                                }
                                <Typography variant="body2" color="textSecondary" style={{ marginBottom: 10 }}>
                                    Note: {(this.state.accountPresent) ? "Signing in" : "Registering"} as Reader
                                </Typography>
                                <Button color="primary" variant="contained" onClick={this.loginButtonClicked}>
                                        {(this.state.accountPresent) ? "Login" : "Register"}
                                </Button>
                                <Typography variant="body2" color="secondary" style={{ marginTop: 10 }}>
                                    {this.state.userExists}
                                </Typography>
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
                                {  (this.state.accountPresent)?(<div />):(
                                    <div>
                                        <TextField onChange={this.password2Changed} 
                                                label="Password2" placeholder={"Confirm Password"} 
                                                type="password" value={this.state.password2Publisher}/>
                                        <br />
                                        {
                                            this.state.passwordMatchingPublisher
                                        }
                                        <br /><br />
                                    </div>
                                    )
                                }
                                <Typography variant="body2" color="textSecondary" style={{ marginBottom: 10 }}>
                                    Note: {(this.state.accountPresent)?"Signing in":"Registering"} as Publisher
                                </Typography>
                                <Button color="primary" variant="contained" onClick={this.loginButtonClicked}>
                                    {(this.state.accountPresent) ? "Login" : "Register"}
                                </Button>
                                <Typography variant="body2" color="secondary" style={{ marginTop: 10 }}>
                                    {this.state.userExists}
                                </Typography>
                            </div>
                        )
                    }
                </Container>
            </div>
            </Router>
        )));
    }
}

export default LoginSignup;