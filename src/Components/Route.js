import React from "react";
import axios from "axios";
import {Switch, Route, BrowserRouter as Router} from "react-router-dom";
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
            child: <Login targetUsername={this.changeUsername} />
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

    LoginCheck(obj){
        let cookie=new Cookies();
        if(cookie.get("AuthToken")===undefined)
            return false;
        console.log(cookie.get("AuthToken"));
        let s = cookie.get("AuthToken");
        let p=0;
        axios.get('https://bharatekkhoj.herokuapp.com/api/auth/user',{
            headers:{
                "Authorization":"Token " + s
            }
        }).then(res => {
            p=res.data
            this.setState({
                child: obj
            })
        }).catch(this.setState({
            child: <Login targetUsername={this.changeUsername} />
        }));
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
                {this.state.child}
                <Switch>
                    <Route exact path='/'>
                        {
                            this.LoginCheck((this.isPublisher()?<Publisher uname={this.state.username} />:<User uname={this.state.username} />))
                        }
                    </Route>
                    <Route exact path='/login'>
                        <Login targetUsername={this.changeUsername} />
                    </Route>
                    <Route exact path='/user/:id'>
                        {
                            this.LoginCheck(<User uname={this.state.username} />)
                        }
                    </Route>
                    <Route exact path='/book/:id'>
                    {
                            this.LoginCheck(<Book />)
                        }
                    </Route>
                    <Route exact path='/publisher/:id'>
                    {
                            this.LoginCheck(<Publisher uname={this.state.username} />)
                        }
                    </Route>
                </Switch>
            </Router>
        );
    }
}


export default Routing;