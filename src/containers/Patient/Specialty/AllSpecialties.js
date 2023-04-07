import React, { Component } from 'react';
import { connect } from 'react-redux';
import './AllSpecialties.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { getAllSpecialty } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import { withRouter } from 'react-router';
class AllSpecialties extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allSpecialties: [],
        };
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {}

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                allSpecialties: res.data,
            });
        }
    }

    handleViewDetailSpecialty = (specialty) => {
        this.props.history.push(`/detail-specialty/${specialty.id}`);
    };

    render() {
        let { allSpecialties } = this.state;

        return (
            <div className="all-section-container">
                <HomeHeader isShowBanner={false} />
                <div className="all-section-header container-md">Chuyên khoa phổ biến</div>
                <div className="all-section-body container-md">
                    {allSpecialties &&
                        allSpecialties.length > 0 &&
                        allSpecialties.map((item, index) => {
                            return (
                                <div
                                    onClick={() => this.handleViewDetailSpecialty(item)}
                                    className="each-section "
                                    key={index}
                                >
                                    <div
                                        className="avatar-section"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    ></div>
                                    <div
                                        className="basic-title"
                                        style={{
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        {item.name}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllSpecialties));
