import React from "react";
import axios from "axios";
import {Switch, Route, Redirect, BrowserRouter as Router} from "react-router-dom";
import Cookies from "universal-cookie";

import Publisher from './Publisher'
import User from './User'
import Book from './Book'
import Login from './Login'

class Routing extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            username: "",
            bname: "",
            loggedIn: false,
        }
        this.changeUsername = this.changeUsername.bind(this);
        this.changeBookname = this.changeBookname.bind(this);
    }

    // componentDidMount(){
    //     axios.get('https://bharatekkhoj.herokuapp.com/api/auth/user').then(res => {
    //         console.log("GEE");
    //         let { id } = useParams();
    //         <Redirect to={id} />
    //     }).catch(res => {
    //         <Redirect to="/login" />
    //     })
    // }

    changeUsername(name){
        this.setState({
            username: name
        });
    }

    changeBookname(name){
        this.setState({
            bname: name
        });
    }

    LoginCheck(){
        let cookie=new Cookies();
        if(cookie.get("AuthToken")===undefined)
            return false;
        console.log(cookie.get("AuthToken"));
        let s = cookie.get("AuthToken");
        console.log(s);
        let p=0;
        axios.post('https://bharatekkhoj.herokuapp.com/auth/dj-rest-auth/token/verify/',{
                "token":s
        }
        ).then(res => {
            p=1;
            console.log("AUTHENTICATION SUCCESSFUL");
            console.log(p);
            this.setState({
                loggedIn: true
            })
        }).catch(res=>{
            console.log(res.response);
            this.setState({
                loggedIn: false
            })
        });
    }
    
    isPublisher(){
        axios.get(`https://bharatekkhoj.herokuapp.com/api/users/reader/${this.state.username}/`).then(res=>{
            if(res.data===1)
                return false;
            return true;
        })
    }

    render(){
        return (
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <Redirect to='/login' />
                    </Route>
                    <Route exact path='/login'>
                        <Login targetUsername={this.changeUsername} />
                    </Route>
                    <Route exact path='/user/:id'>
                        <User uname={this.state.username} targetBookname={this.changeBookname}/>
                    </Route>
                    <Route exact path='/book/:id'>
                        <Book bname = {this.state.bname}/>
                    </Route>
                    <Route exact path='/publisher/:id'>
                        <Publisher uname={this.state.username}/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}


export default Routing;