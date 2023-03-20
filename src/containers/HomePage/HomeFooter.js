import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'


class Footer extends Component {


    render() {

        return (
            <div className='home-footer'>
                <p>&copy; 2022 Phung Quoc Toan. <a target='_blank' href='#'> &#8592; More information &#8594;</a></p>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
