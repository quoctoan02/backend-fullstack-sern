import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../HomePage.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllSpecialty } from '../../../services/userService';
import { withRouter } from 'react-router';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allSpecialties: [],
        };
    }
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

    getAllSpecialties = () => {
        this.props.history.push('/all-specialties');
    };
    render() {
        let { allSpecialties } = this.state;
        console.log(this.props.settings);
        return (
            <div className="section-share section-specialty">
                <div className="section-container container-md">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="homepage.popular-specialty" />
                        </span>
                        <button
                            className="btn-section"
                            onClick={() => this.getAllSpecialties()}
                        >
                            <FormattedMessage id="homepage.more-info" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {allSpecialties &&
                                allSpecialties.length > 0 &&
                                allSpecialties.map((item, index) => {
                                    return (
                                        <div
                                            onClick={() => this.handleViewDetailSpecialty(item)}
                                            className="section-customize specialty-child"
                                            key={index}
                                        >
                                            <div
                                                className="bg-image section-specialty"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            <div className="section-name">{item.name}</div>
                                        </div>
                                    );
                                })}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
