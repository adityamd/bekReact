import React from 'react'
import axios from 'axios'

import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PublishIcon from '@material-ui/icons/Publish';
import Grid from '@material-ui/core/Grid';

import "./Styles/ModalForm.css"

class ModalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            book_name: this.props.book_name,
            price: this.props.price,
            genre: this.props.genre,
            language: this.props.language,
            publisher: this.props.publisher
        };
        this.titleChanged = this.titleChanged.bind(this);
        this.priceChanged = this.priceChanged.bind(this);
        this.genreChanged = this.genreChanged.bind(this);
        this.languageChanged = this.languageChanged.bind(this);
        this.modalEntered = this.modalEntered.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    titleChanged(e) {
        this.setState({
            book_name: e.target.value
        });
    }

    priceChanged(e) {
        this.setState({
            price: e.target.value
        });
    }

    genreChanged(e) {
        this.setState({
            genre: e.target.value
        });
    }

    languageChanged(e) {
        this.setState({
            language: e.target.value
        });
    }


    onSubmit(e) {
        if (this.props.canUpdate) {
            console.log(this.state.book_name+" " + this.props.book_name);
            axios.post(`http://bharatekkhoj.herokuapp.com/api/books/update/${this.props.book_name}`, {
                bname: this.state.book_name,
                price: this.state.price,
                genre: this.state.genre,
                lang: this.state.language,
                publisher: this.state.publisher
            })
                .then(res => { console.log(res); });
        }
        else {
            axios.post(`http://bharatekkhoj.herokuapp.com/api/books/add/${this.state.publisher}`, {
                bname: this.state.book_name,
                price: this.state.price,
                genre: this.state.genre,
                lang: this.state.language,
                publisher: this.state.publisher
            })
                .then(res => { console.log(res); });
        }
        this.props.onClose();
        this.props.openSnackbar();
        this.props.loadAgain();
    }

    modalEntered(e) {
    }

    render() {
        return (
            <Modal open={this.props.open} onClose={this.props.onClose}
                style={{
                    backgroundColor: "white", height: 300,
                    width: 600, margin: "auto", padding: 15, borderRadius: 10,
                    borderWidth: 2, borderColor: "indigo", borderStyle: "solid"
                }} onRendered={this.modalEntered} hideBackdrop>
                <div>
                    <IconButton style={{ float: "right" }} onClick={this.props.closeModal}>
                        <HighlightOffIcon />
                    </IconButton>
                    <form>
                        <TextField fullWidth autoFocus variant="filled"
                            label="Book Name" defaultValue={this.state.book_name} onChange={this.titleChanged} />
                        <br /><br />
                        <div style={{marginTop:10}}>
                            <TextField type="number" variant="filled" label="Price"
                                defaultValue={this.state.price} onChange={this.priceChanged}/>
                            <InputLabel style={{display:"inline",marginLeft:20}}>Genre</InputLabel>
                            <Select style={{marginLeft:10}} value={this.state.genre} onChange={ this.genreChanged}>
                                <MenuItem value="Romantic">Romantic</MenuItem>
                                <MenuItem value="Drama">Drama</MenuItem>
                                <MenuItem value="Thriller">Thriller</MenuItem>
                                <MenuItem value="Comedy">Comedy</MenuItem>
                                <MenuItem value="Action">Action</MenuItem>
                            </Select>
                            <InputLabel style={{ display: "inline", marginLeft: 20 }} className="inline_input_label">Language</InputLabel>
                            <Select style={{marginLeft:10}} value={this.state.language} onChange={this.languageChanged} >
                                    <MenuItem value="English">English</MenuItem>
                                    <MenuItem value="Hindi">Hindi</MenuItem>
                                    <MenuItem value="Gujarati">Gujarati</MenuItem>
                                    <MenuItem value="Bengali">Bengali</MenuItem>
                                    <MenuItem value="Kannada">Kannada</MenuItem>
                                    <MenuItem value="Tamil">Tamil</MenuItem>
                                    <MenuItem value="Telugu">Telugu</MenuItem>
                                    <MenuItem value="Malayalam">Malayalam</MenuItem>
                                    <MenuItem value="Marathi">Marathi</MenuItem>
                                    <MenuItem value="Odiya">Odiya</MenuItem>
                                    <MenuItem value="Rajasthani">Rajasthani</MenuItem>
                                    <MenuItem value="Punjabi">Punjabi</MenuItem>
                                    <MenuItem value="Harayanvi">Harayanvi</MenuItem>
                                    <MenuItem value="Bhojpuri">Bhojpuri</MenuItem>
                                    <MenuItem value="Kashmiri">Kashmiri</MenuItem>
                            </Select>
                        </div>
                        <br />
                        <Grid container justify="center">
                            <Button 
                                variant="contained" color="primary" onClick={this.onSubmit}
                                startIcon={<PublishIcon />}>
                                Submit
                            </Button>
                        </Grid>
                    </form>
                </div>
            </Modal>
        );
    }
}

export default ModalForm;