import React from 'react'
import axios from 'axios'

import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import SimpleCard from './BookCard'
import './Styles/Publisher.css'
import ModalForm from './ModalForm'
import Layout from './Layout'
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'

class Publisher extends React.Component {
    constructor(props) {
        super(props);
        let cookie = new Cookies();
        console.log(cookie.get("username"));
        this.state = {
            loaded: false,
            publisher: cookie.get("username"),
            loadModal: false,
            publishes: [],
            book_name: "",
            price: "",
            genre: "",
            language: "",
            openDialog: false,
            openSnackbar: false,
            redirectLogin: false
        };
        this.onEdit = this.onEdit.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.loadAgain = this.loadAgain.bind(this);
        this.onCloseDialog = this.onCloseDialog.bind(this);
        this.deletePublication = this.deletePublication.bind(this);
        this.openSnackbar = this.openSnackbar.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
        this.onAdd = this.onAdd.bind(this);
    }

    componentDidMount() {
        let cookie = new Cookies();
        axios.get(`https://bharatekkhoj.herokuapp.com/api/books/pubs/${this.state.publisher}/`,{
            headers:{
                "Authorization": "Token "+ cookie.get("BackendToken")
            }
        }).then(res => {
            this.setState({
                publishes: res.data,
                loaded: true,
                publicationId: "pub"
            });
        }).catch(res => {
            this.setState({
                redirectLogin: true
            });
        });
    }

    onEdit(e, bname, price_, genre_, language_) {
        console.log(bname);
        this.setState({
            book_name: bname,
            price: price_,
            genre: genre_,
            language: language_,
            loadModal: true,
            canUpdate:true
        });
    }

    onAdd(e, bname, price_, genre_, language_) {
        console.log(bname);
        this.setState({
            loadModal: true,
            canUpdate: false
        });
    }

    loadAgain() {
        let cookie = new Cookies();
        console.log(this.state.publisher);
        axios.get(`https://bharatekkhoj.herokuapp.com/api/books/pubs/${this.state.publisher}`,{
            headers:{
                "Authorization": "Token "+ cookie.get("BackendToken")
            }
        }).then(res => {
            this.setState({
                publishes: res.data,
            });
        });
    }

    onCloseDialog(e) {
        this.setState({
            openDialog: false
        });
    }

    openDeletionDialog(e,name) {
        this.setState({
            openDialog: true,
            book_name: name
        });
    }

    deletePublication(e, name) {
        let cookie = new Cookies();
        axios.get(`https://bharatekkhoj.herokuapp.com/api/books/delete/${this.state.book_name}`,{
            headers:{
                "Authorization": "Token "+ cookie.get("BackendToken")
            }
        }).then(res => { console.log(res); }).catch(res => {console.log(res.response);});
        this.setState({
            openDialog: false
        });
        axios.get(`https://bharatekkhoj.herokuapp.com/api/books/pubs/${this.state.publisher}`,{
            headers:{
                "Authorization": "Token "+ cookie.get("BackendToken")
            }
        }).then(res => {
            this.setState({
                publishes: res.data,
            });
        });
    }

    closeModal(e) {
        this.setState({
            loadModal: false,
            book_name: ""
        });
    }

    openSnackbar(e) {
        this.setState({
            openSnackbar: true
        });
    }


    closeSnackbar(e) {
        this.setState({
            openSnackbar: false
        });
    }

    render() {
        return (
            this.state.redirectLogin?(<Redirect to='/login' />):(
            <div>
                <Layout AppBarHeading='Publisher' AppBarChild={(
                    <Button href={'#pub'}>
                        <Typography variant="subtitle2" style={{ color: "white" }}>
                            Your Publications
                                </Typography>
                    </Button>
                )}
                    heading={this.state.publisher}>
                <Container className="Cont" id="pub">
                    <Typography variant="h4" align="left">
                        Your Publications
                    </Typography>
                    <Grid container spacing={3} className="booksCont">
                        {
                            this.state.publishes.map(publish => {
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
                                            <Button style={{ marginTop: 20 }} variant="contained"
                                                color="primary"
                                                onClick={(e) => this.onEdit(e, publish.bname, publish.price, publish.genre, publish.lang)}>
                                                Edit
                                            </Button>
                                            <Button style={{ marginTop: 20, marginLeft: 10 }} variant="contained"
                                                color="secondary" onClick={(e) => { this.openDeletionDialog(e, publish.bname); }}>
                                                Delete
                                            </Button>
                                        </SimpleCard>
                                    </Grid>
                                    );
                            })
                        }
                    </Grid>
                    <ModalForm open={this.state.loadModal} onClose={() => this.closeModal()}
                        closeModal={this.closeModal}
                        book_name={this.state.book_name} price={this.state.price} genre={this.state.genre}
                        language={this.state.language} publisher={this.state.publisher}
                        loadAgain={this.loadAgain} openSnackbar={this.openSnackbar} canUpdate={this.state.canUpdate} />
                    <Dialog open={this.state.openDialog} onClose={this.onCloseDialog}>
                        <DialogTitle>Delete the publication</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Are you sure, you want to delete the publication?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={this.onCloseDialog}>Cancel</Button>
                            <Button color="secondary" onClick={this.deletePublication}>Okay</Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar open={this.state.openSnackbar} onClose={this.closeSnackbar}
                        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        message={"Book "+((this.state.canUpdate)?"updated":"added") + ", refresh page to view the changes"}
                        autoHideDuration={5000} action={
                            <IconButton onClick={this.closeSnackbar}>
                                <CloseIcon />
                            </IconButton>
                        } />
                    <Fab color="primary" variant="extended" style={{
                        position: "fixed",
                        bottom: 20,
                        right: 20
                    }} onClick={ this.onAdd}>
                        <AddIcon />
                        Add a Publication
                    </Fab>
                    </Container>
                </Layout>
            </div>
        ));
    }
}

export default Publisher;