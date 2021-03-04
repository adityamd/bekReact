import React from 'react'
import axios from 'axios'

import Layout from './Layout'
import SimpleCard from './BookCard'
import {Link, Redirect} from "react-router-dom";

import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextareaAutosize } from '@material-ui/core'
import Cookies from 'universal-cookie';

class User extends React.Component {

    constructor(props) {
        super(props);
        let cookie = new Cookies();
        this.state = ({
            username: cookie.get("username"),
            subscribers: [],
            booksPublishers: [],
            booksSubscribed: [],
            exploreBooks: [],
            writeReview: false,
            reviewValue: "",
            bookReviewed: "",
            posted: false,
            redirectLogin: false
        });
        this.writeReview = this.writeReview.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.textChanged = this.textChanged.bind(this);
        this.postReview = this.postReview.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
    }

    componentDidMount() {
        var cookie = new Cookies();
        axios.get(`https://bharatekkhoj.herokuapp.com/api/books/`,{
            headers:{
                "Authorization": "Token "+ cookie.get("BackendToken")
            }
        }).then(res => {
            this.setState({
                exploreBooks: res.data
            });
        }).catch(res => {
            console.log(res.response);
        })
        axios.get(`https://bharatekkhoj.herokuapp.com/api/subscribes/${this.state.username}`,{
            headers:{
                "Authorization": "Token "+ cookie.get("BackendToken")
            }
        }).then(res => {
            this.setState({
                subscribers: res.data
            });
            for (let i = 0; i < this.state.subscribers.length; i++) {
                axios.get(`https://bharatekkhoj.herokuapp.com/api/books/pubs/i/${this.state.subscribers[i].publisher}`,{
                    headers:{
                        "Authorization": "Token "+ cookie.get("BackendToken")
                    }
                }).then(
                    res => {
                        var publishes=[];
                        publishes = publishes.concat(res.data);
                        console.log(publishes);
                        this.setState({
                            booksPublishers: publishes
                        });
                        console.log(this.state.booksPublishers);
                    }
                ).catch(res=>{
                    this.setState({
                        redirectLogin: true
                    });
                });;
            }
        }).catch(res=>{
            this.setState({
                redirectLogin: true
            });
        });

        axios.get(`https://bharatekkhoj.herokuapp.com/api/purchases/${this.state.username}/`,{
            headers:{
                "Authorization": "Token "+ cookie.get("BackendToken")
            }
        }).then(res => {
            this.setState({
                booksSubscribed: res.data
            });
        }).catch(res=>{
            this.setState({
                redirectLogin: true
            });
        });
    }

    closeAlert(e) {
        this.setState({
            posted: false
        });
    }

    writeReview(e,bname) {
        this.setState({
            writeReview: true,
            bookReviewed: bname
        });
    }

    postReview(e) {
        var d = new Date();
        let cookie = new Cookies();
        axios.post(`https://bharatekkhoj.herokuapp.com/api/reviews/add/`, {
            user: this.state.username,
            book: this.state.bookReviewed,
            review: this.state.reviewValue,
            date_posted: d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
        },{
            headers:{
                "Authorization": "Token "+ cookie.get("BackendToken")
            }
        }).then(res => { console.log(res); }).catch(res=>{
            this.setState({
                redirectLogin: true
            });
        });

        this.setState({
            reviewValue: "",
            writeReview: false,
            posted: true
        });
    }

    closeDialog(e) {
        this.setState({
            writeReview: false,
            reviewValue: "",
            bookReviewed: ""
        });
    }

    textChanged(e) {
        this.setState({
            reviewValue: e.target.value
        });
    }

    render() {
        return (
            (this.state.redirectLogin)?(<Redirect to='/login' />):(

            <div>
                <Layout AppBarHeading="User" AppBarChild={(
                    <div>
                        <Button href="#exploreBooks" style={{color:"white"}}>Explore books</Button>
                        <Button href="#otherBooks" style={{color:"white"}}>More books</Button>
                        <Button href="#purchasedBooks" style={{ color: "white" }}>Purchased books</Button>
                    </div>
                    )} heading={"Hi, " + this.state.username} >
                    
                    <Container style={{ width: 10000 }} id="exploreBooks">
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">
                                    Explore books
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {
                                        this.state.exploreBooks.map(publish => {
                                            return (
                                                <Grid item lg={3} key={publish.id}>
                                                    <SimpleCard csName="crd" TooltipText={publish.bname}
                                                        TooltipPlacement="top-start"
                                                        style={{ marginTop: 15 }}
                                                        book_name={publish.bname} price={publish.price} genre={publish.genre}
                                                        language={publish.language}
                                                    >
                                                        <Typography variant="h5" component="h2" noWrap>
                                                            {publish.bname}
                                                        </Typography>
                                                        <Typography color="textSecondary">
                                                            Price: Rs.{publish.price}
                                                        </Typography>
                                                        <Typography variant="body2" component="p">
                                                            Genre: {publish.genre}
                                                            <br />
                                                            Language: {publish.lang}
                                                        </Typography>
                                                        <Link to={"/book/" + publish.bname} >
                                                            <Button color="primary" style={{ marginTop: 20 }} variant="contained"
                                                                onClick={(nm) => {
                                                                    let cookie = new Cookies();
                                                                    cookie.set("bname",publish.bname)
                                                                    }}>
                                                                View
                                                            </Button>
                                                        </Link>
                                                    </SimpleCard>
                                                </Grid>
                                            );
                                        })
                                    }
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Container>

                    <Container style={{ marginTop: 40 ,width: 10000 }} id="otherBooks">
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">
                                    More From Publishers You Have Subscribed To
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {
                                        this.state.booksPublishers.map(publish => {
                                            return (
                                                <Grid item lg={3} key={publish.id}>
                                                    <SimpleCard csName="crd" TooltipText={publish.bname}
                                                        TooltipPlacement="top-start"
                                                        style={{ marginTop: 15 }}
                                                        book_name={publish.bname} price={publish.price} genre={publish.genre}
                                                        language={publish.language}
                                                    >
                                                        <Typography variant="h5" component="h2" noWrap>
                                                            {publish.bname}
                                                        </Typography>
                                                        <Typography color="textSecondary">
                                                            Price: Rs.{publish.price}
                                                        </Typography>
                                                        <Typography variant="body2" component="p">
                                                            Genre: {publish.genre}
                                                            <br />
                                                            Language: {publish.lang}
                                                        </Typography>
                                                        <Link to={"/book/" + publish.bname} >
                                                            <Button color="primary" style={{ marginTop: 20 }} variant="contained">
                                                                View
                                                            </Button>
                                                        </Link>
                                                    </SimpleCard>
                                                </Grid>
                                            );
                                        })
                                    }
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Container>

                    <Container style={{ marginTop: 40 }} id="purchasedBooks">
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">
                                    Books You Have Purchased
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {
                                        this.state.booksSubscribed.map(publish => {
                                            return (
                                                <Grid item lg={3} key={publish.id}>
                                                    <SimpleCard csName="crd" TooltipText={publish.bname}
                                                        TooltipPlacement="top-start"
                                                        style={{ marginTop: 15 }}
                                                        book_name={publish.bname} price={publish.price} genre={publish.genre}
                                                        language={publish.language}
                                                    >
                                                        <Typography variant="h5" component="h2" noWrap>
                                                            {publish.bname}
                                                        </Typography>
                                                        <Typography color="textSecondary">
                                                            Price: Rs.{publish.price}
                                                        </Typography>
                                                        <Typography variant="body2" component="p">
                                                            Genre: {publish.genre}
                                                            <br />
                                                            Language: {publish.lang}
                                                        </Typography>
                                                        <Button onClick={(e)=>{this.writeReview(e,publish.bname);}} 
                                                    color="primary" style={{ marginTop: 20 }} variant="contained">
                                                            Write a review
                                                        </Button>
                                                    </SimpleCard>
                                                </Grid>
                                            );
                                        })
                                    }
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Container>
                </Layout>
                <Dialog open={this.state.writeReview} onClose={this.closeDialog} >
                    <DialogTitle>
                        Write a Review
                    </DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText>
                            <TextareaAutosize rows={50} cols={ 75} rowsMax={15} rowsMin={1} onChange={this.textChanged}/>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="secondary" onClick={this.closeDialog} > Cancel</Button>
                        <Button variant="contained" color="primary" onClick={this.postReview}>Post</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={this.state.posted} autoHideDuration={5000} onClose={this.closeAlert}>
                    <Alert severity="success" onClose={this.closeAlert} variant="standard" >
                        Review Posted
                    </Alert>
                </Snackbar>
            </div>
            )
        );
    }
}

export default User;