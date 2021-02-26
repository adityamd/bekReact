import React from 'react'
import axios from 'axios'

import Layout from './Layout'
import './Styles/Book.css'
import Review from './Review.js'

import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import RateReviewIcon from '@material-ui/icons/RateReview'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle, ListItem, ListSubheader, TextField, Snackbar } from '@material-ui/core'

class Book extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            book_name: "Database Design",
            publisher: "S.Chand",
            price: 60,
            genre: "Drama",
            language: "Hindi",
            synopsis: "This book is for both professionals and students who wish to make a career as a database designer or some related field. It talks about various databases, approaches regarding designing a database and maintaining it and lastly, talking about the future of databases.",
            reviews: [],
            user: "adityamd",
            subscribed: true,
            reviewValue: "",
            openDialogBox: false,
            posted: false,
            bookPurchased: false,
            purchased: false
        };
        this.subscribed = this.subscribed.bind(this);
        this.addSubscription = this.addSubscription.bind(this);
        this.deleteSubscription = this.deleteSubscription.bind(this);
        this.postReview = this.postReview.bind(this);
        this.onReviewChange = this.onReviewChange.bind(this);
        this.openDialogBox = this.openDialogBox.bind(this);
        this.closeDialogBox = this.closeDialogBox.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.closePurchasedDB = this.closePurchasedDB.bind(this);
        this.purchaseBook = this.purchaseBook.bind(this);
    }

    componentDidMount() {
        axios.get(`http://bharatekkhoj.herokuapp.com/api/reviews/${this.state.book_name}/`).then(res => {
            this.setState({
                reviews: res.data
            });
        });
    }

    onReviewChange(e) {
        this.setState({
            reviewValue: e.target.value
        });
    }

    addSubscription() {
        axios.post(`http://bharatekkhoj.herokuapp.com/api/subscribes/add/publisher/`, {
            users: this.state.user,
            publisher: this.state.publisher
        }).then(res => { console.log(res); });
    }

    deleteSubscription() {
        axios.get(`http://bharatekkhoj.herokuapp.com/api/subscribes/delete/${this.state.user}/${this.state.publisher}/`).then(
            res => { console.log(res);}
        );
    }

    purchaseBook(e) {
        axios.post(`http://bharatekkhoj.herokuapp.com/api/purchases/added/p`, {
            user: this.state.user,
            book: this.state.book_name
        }).then(res => {
            console.log(res);
            this.setState({
                purchased: true
            })
        });
    }

    postReview(e) {
        var d = new Date();
        axios.post(`http://bharatekkhoj.herokuapp.com/api/reviews/add/`,{
            user:  this.state.user ,
            book: this.state.book_name,
            review: this.state.reviewValue,
            date_posted: d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
        }).then(res => { console.log(res); });

        this.setState({
            reviewValue: "",
            posted: true
        });

        axios.get(`http://bharatekkhoj.herokuapp.com/api/reviews/${this.state.book_name}/`).then(res => {
            this.setState({
                reviews: res.data
            });
        });
    }

    closeAlert(e) {
        this.setState({
            posted: false
        });
    }

    subscribed(e) {
        if (!this.state.subscribed) {
            this.addSubscription();
            this.setState({
                subscribed: true
            });
        }
        else {
            this.deleteSubscription();
            this.setState({
                subscribed: false
            });
        }
    }

    openDialogBox(e) {
        if (!this.state.purchased) {
            this.setState({
                openDialogBox: true
            });
        }
    }

    closePurchasedDB(e) {
        this.setState({
            bookPurchased: false
        })
    }

    closeDialogBox(e) {
        this.setState({
            openDialogBox: false,
            bookPurchased: true
        });
    }

    render() {
        return (
            <div>
                <Layout AppBarHeading="Book" AppBarChild={null}>
                    <Grid container spacing={3}>
                        <Grid item lg={4} sm={12} alignContent="center">
                            <Typography variant="h4">
                                {this.state.book_name }
                            </Typography>
                            <Typography variant="h6">
                                {"Publisher: "+this.state.publisher}
                            </Typography>
                            <Typography variant="h6">
                                {"Price: Rs." + this.state.price}
                            </Typography>
                            <Typography variant="h6">
                                {"Genre: " + this.state.genre}
                            </Typography>
                            <Typography variant="h6">
                                {"Language: " + this.state.language}
                            </Typography>
                            <Button variant="contained" onClick={ this.openDialogBox} style={{ marginTop: 20 }} color="primary">
                                {
                                    (this.state.purchased) ? 
                                        (
                                            <CheckCircleIcon className="ButtonIcon" />
                                        ) :
                                        (
                                                < ShoppingBasketIcon className="ButtonIcon" />
                                        )
                                }
                                {
                                    (this.state.purchased) ?"Purchased":"Purchase"
                                }
                            </Button>
                            <br />
                            <Tooltip interactive title="You will be notified about any new book or an edition from this publisher">
                                <Button variant="contained" style={{ marginTop: 10 }} color="secondary" onClick={this.subscribed}>
                                    {(this.state.subscribed) ? (<FavoriteBorderIcon className="ButtonIcon"/>):(<FavoriteIcon className="ButtonIcon" />)}
                                    {(this.state.subscribed)?"Unsubscribe":"Subscribe to "+this.state.publisher}
                                </Button>
                            </Tooltip>
                        </Grid>
                        <Grid className="gridMiddleItem" item lg={4} sm={12} alignContent="center">
                            <Typography variant="h5">
                                Synopsis:
                            </Typography>
                            <Typography variant="h6">
                                {this.state.synopsis}
                            </Typography>
                        </Grid>
                        <Grid item lg={4} sm={12} alignContent="center">
                            <Typography variant="h5">
                               Read the book?
                            </Typography>
                            <Button href="#review_input" variant="contained" style={{ marginTop: 10 }} color="primary">
                                <RateReviewIcon className="ButtonIcon"/>
                                Rate it and write a review
                            </Button>
                        </Grid>
                    </Grid>
                    <div className="ReviewContainer">
                        <Typography align="left" variant="h5">
                            Reviews
                        </Typography>
                        <ListItem id="review_input">
                            <TextField fullWidth multiline color="primary"
                                variant="outlined" placeholder="Write a Review"
                                helperText={"Note: Writing as " + this.state.user} onChange={this.onReviewChange}
                                value={this.state.reviewValue} />
                            <Button style={{ marginBottom: 20, marginLeft: 5 }} color="secondary"
                                variant="contained" onClick={this.postReview}>
                                Post
                            </Button>
                        </ListItem>
                        {
                            this.state.reviews.map(
                                review => {
                                    return (
                                        <Review text={review.review} secondaryText={"Published on " + review.date_posted}
                                            heading={review.user}/>
                                    );
                                }
                            )
                        }
                    </div>
                </Layout>
                <Dialog open={this.state.bookPurchased} onClose={this.closePurchasedDB} onEnter={this.purchaseBook}>
                    <DialogTitle>
                        Book Purchased
                    </DialogTitle>
                    <DialogContent >
                        <DialogContentText>
                            {"Thank you for purchasing " +this.state.book_name}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.closePurchasedDB}>Okay</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.openDialogBox} onClose={this.closeDialogBox}>
                    <DialogTitle>
                        Module not yet implemented
                    </DialogTitle>
                    <DialogContent >
                        <DialogContentText>
                            Payment module is not yet implemented
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.closeDialogBox}>Okay</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={this.state.posted} autoHideDuration={5000} onClose={ this.closeAlert}>
                    <Alert severity="success" onClose={this.closeAlert} variant="standard" >
                        Review Posted
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

export default Book;