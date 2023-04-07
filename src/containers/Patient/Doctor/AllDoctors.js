import React, { Component } from 'react';
import { connect } from 'react-redux';
import './AllDoctors.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import * as actions from '../../../store/actions';
import HomeHeader from '../../HomePage/HomeHeader';

class AllDoctors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorArr: [],
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({ doctorArr: this.props.topDoctorsRedux });
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors();
    }

    handleViewDetailDoctor = (doctor) => {
        console.log(doctor);
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    };

    render() {
        let { doctorArr } = this.state;
        let { language } = this.props;

        return (
            <div className="all-section-container">
                <HomeHeader isShowBanner={false} />
                <div className="all-section-header container-md">Bác sĩ nổi bật</div>
                <div className="all-section-body container-md">
                    {doctorArr &&
                        doctorArr.length > 0 &&
                        doctorArr.map((item, index) => {
                            let imageBase64 = '';
                            if (item.image) {
                                imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                            }
                            let nameVi = `${item.positionData.valueVi}, ${item.firstName} ${item.lastName}`;
                            let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                            return (
                                <div
                                    className="each-section doctor-section"
                                    onClick={() => this.handleViewDetailDoctor(item)}
                                >
                                    <div
                                        className="avatar-section avatar-doctor"
                                        style={{
                                            backgroundImage: `url('${imageBase64}')`,
                                        }}
                                    ></div>
                                    <div className="basic-title basic-title-doctor">
                                        <div
                                            style={{
                                                fontSize: '1.2rem',
                                            }}
                                        >
                                            {language === LANGUAGES.VI ? nameVi : nameEn}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.9rem',
                                                marginTop: '5px',
                                            }}
                                        >
                                            {item.Doctor_Info.Specialty &&
                                            item.Doctor_Info.Specialty.name
                                                ? item.Doctor_Info.Specialty.name
                                                : ''}
                                        </div>
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
        topDoctorsRedux: state.admin.topDoctors,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllDoctors));
