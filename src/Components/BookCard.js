import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';

import './Styles/BookCard.css'

class SimpleCard extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = {
            book_name: this.props.book_name,
            price: this.price,
            genre: this.genre,
            language: this.language
        }
    }

    onClick(e) {
        e.preventDefault();
        console.log("Clicked");
    }

    render() {

        return (
            <div>
                <Tooltip title={this.props.TooltipText} arrow={true} placement={this.props.TooltipPlacement} >
                    <Card className={this.props.csName}>
                        <CardContent className={this.props.csName + '-content'}>
                            {this.props.children}
                        </CardContent>
                    </Card>
                </Tooltip>
            </div>
        );
    }
}

export default SimpleCard;