import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';
class Clinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allClinics: [],
        };
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                allClinics: res.data,
            });
        }
    }

    handleViewDetailClinic = (clinic) => {
        this.props.history.push(`/detail-clinic/${clinic.id}`);
    };

    getAllClinics = () => {
        this.props.history.push(`/all-clinics`);
    };
    render() {
        let { allClinics } = this.state;
        return (
            <div className="section-share section-medical-facility">
                <div className="section-container container-md">
                    <div className="section-header">
                        <span className="title-section">Cơ sở y tế nổi bật</span>
                        <button
                            className="btn-section"
                            onClick={() => this.getAllClinics()}
                        >
                            <FormattedMessage id="homepage.more-info" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {allClinics &&
                                allClinics.length > 0 &&
                                allClinics.map((item, index) => {
                                    return (
                                        <div
                                            onClick={() => this.handleViewDetailClinic(item)}
                                            className="section-customize clinic-child"
                                            key={index}
                                        >
                                            <div
                                                className="bg-image section-clinic"
                                                style={{
                                                    backgroundImage: `url(${item.avatar})`,
                                                }}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Clinic));
