import React from 'react';
import axios from 'axios';

class ListView extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            list: [],
            name: ""
        };
    }

    componentDidMount() {
        axios.get(`http://127.0.0.1:8000/api/warehouses/`).then(res => {
            this.setState({
                list: res.data.map(warehouse => { return warehouse["location"]})
            });
        });
    }

    onSubmit(e) {
        e.preventDefault();
        axios.post(`http://127.0.0.1:8000/api/warehouses/add/`,
            { location: this.state.name }).
            then(res => { console.log(res); });
    }

    onChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    render() {
        return (
            <ul>
                {this.state.list.map(elem => { return <li>{elem}</li> })}
                <form onSubmit={this.onSubmit} >
                    <label>
                        Location:
                        <input type="text" name="location" onChange={this.onChange} />
                        <input type="submit" value="Add Location" />
                    </label>
                </form>
            </ul>
        );
    }
}

export default ListView;