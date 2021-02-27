import React from "react";
import axios from "axios";
import {Switch, Route, Redirect, Router} from "react-router-dom";
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
            loggedIn: false,
        }
        this.changeUsername = this.changeUsername.bind(this);
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

    LoginCheck(){
        let cookie=new Cookies();
        if(cookie.get("AuthToken")===undefined)
            return false;
        console.log(cookie.get("AuthToken"));
        let s = cookie.get("AuthToken");
        axios.get('https://bharatekkhoj.herokuapp.com/api/auth/user',{
            headers:{
                "Authorization":"Token " + s
            }
        }).then(res => {
            console.log(res);
            return true;
        }).catch(res=>{return false});
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
                        {
                            this.LoginCheck()?(this.isPublisher?<User uname={this.state.username}/>:<Publisher uname={this.state.username} />):
                            <Redirect to='/login' />
                        }
                    </Route>
                    <Route exact path='/login'>
                        <Login targetUsername={this.changeUsername} />
                    </Route>
                    <Route exact path='/user/:id'>
                        {
                            this.LoginCheck()?<User uname={this.state.username}/>:
                            <Redirect to='/login' />
                        }
                    </Route>
                    <Route exact path='/book/:id'>
                    {
                            this.LoginCheck()?<Book />:
                            <Redirect to='/login' />
                        }
                    </Route>
                    <Route exact path='/publisher/:id'>
                    {
                            this.LoginCheck()?<Publisher uname={this.state.username}/>:
                            <Redirect to='/login' />
                        }
                    </Route>
                </Switch>
            </Router>
        );
    }
}


export default Routing;