import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ProfileDoctor.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import './ProfileDoctor.scss';
import { getProfileDoctor } from '../../../services/userService';
import { NumericFormat } from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {},
        };
    }

    async componentDidMount() {
        let data = await this.getProfileDoctorFromApi(this.props.doctorId);
        this.setState({
            dataProfile: data,
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.doctorId !== prevProps.doctorId) {
            let data = await this.getProfileDoctorFromApi(this.props.doctorId);
            this.setState({
                dataProfile: data,
            });
        }
    }
    getProfileDoctorFromApi = async (doctorId) => {
        let result = {};
        let id = this.props.doctorId;
        if (id) {
            let res = await getProfileDoctor(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    };
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    renderTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time =
                language === LANGUAGES.VI
                    ? dataTime.timeTypeData.valueVi
                    : dataTime.timeTypeData.valueEn;
            let date =
                language === LANGUAGES.VI
                    ? moment(dataTime.date).format('dddd - DD/MM/YYYY')
                    : moment(dataTime.date).locale('en').format('ddd - DD/MM/YYYY');
            return (
                <>
                    <div>
                        {time} - {this.capitalizeFirstLetter(date)}
                    </div>
                    <div>
                        <FormattedMessage id="patient.profile-doctor.free-booking" />
                    </div>
                </>
            );
        }
        return <></>;
    };
    render() {
        let { dataProfile } = this.state;
        let doctorInfo = dataProfile.Doctor_Info;
        let { language, dataTime, isHidePrice, isShowLinkDetail, doctorId, isShowDescription } =
            this.props;
        let nameVi = '';
        let nameEn = '';
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi} ${dataProfile.firstName} ${dataProfile.lastName}`;
            nameEn = `${dataProfile.positionData.valueEn} ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    <div
                        className="content-left"
                        style={{
                            backgroundImage: `url(${dataProfile.image})`,
                        }}
                    ></div>
                    <div className="content-right">
                        <div className="up">{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                        <div className="down">
                            {isShowDescription &&
                                dataProfile &&
                                dataProfile.Markdown &&
                                dataProfile.Markdown.description && (
                                    <span style={{ whiteSpace: 'pre-wrap' }}>
                                        {dataProfile.Markdown.description}
                                    </span>
                                )}
                            {this.renderTimeBooking(dataTime)}
                        </div>
                    </div>
                </div>
                {isShowLinkDetail && (
                    <div className="view-detail-doctor">
                        <Link to={`/detail-doctor/${doctorId}`}>Xem thêm</Link>
                    </div>
                )}
                {!isHidePrice && (
                    <div className="price">
                        <FormattedMessage id="patient.profile-doctor.price" />
                        {dataProfile && dataProfile.Doctor_Info && language === LANGUAGES.VI && (
                            <NumericFormat
                                className="currency"
                                value={dataProfile.Doctor_Info.priceData.valueVi}
                                displayType={'text'}
                                thousandSeparator="."
                                decimalSeparator=","
                                suffix={'VND'}
                            />
                        )}
                        {dataProfile && dataProfile.Doctor_Info && language === LANGUAGES.EN && (
                            <NumericFormat
                                className="currency"
                                value={dataProfile.Doctor_Info.priceData.valueEn}
                                displayType={'text'}
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix={'$'}
                            />
                        )}
                    </div>
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
