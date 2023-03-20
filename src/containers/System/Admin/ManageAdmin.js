import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'
import './ManageDoctor.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { LANGUAGES } from '../../../utils';


class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: null,
            description: '',
            listDoctors: [],
        }
    }



    render() {
        return (
            <div className='icon-container'>
                <div className='icon-content'><i className="fa-light fa-newspaper"></i></div>
                <div className='icon-content'><i classname="fa-solid fa-film"></i></div>
                <div className='icon-content'><i className="fa-light fa-microphone"></i></div>
                <div className='icon-content'><i className="fa-light fa-play"></i></div>
                <div className='icon-content'><i className="fa-light fa-house"></i></div>
                <div className='icon-content'><i className="fa-solid fa-arrow-trend-up"></i></div>
                <div className='icon-content'><i className="fa-solid fa-podcast"></i></div>
                <div className='icon-content'><i className="fa-solid fa-magnifying-glass"></i></div>
                <div className='icon-content'><i className="fa-solid fa-list-ul"></i></div>
                <div className='icon-content'><i className="fa-solid fa-gear"></i></div>
                <div className='icon-content'><i className="fa-regular fa-bookmark"></i></div>
                <div className='icon-content'><i className="fa-regular fa-comment"></i></div>
                <div className='icon-content'><i className="fa-regular fa-star"></i></div>
                <div className='icon-content'><i className="fa-solid fa-share"></i></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
