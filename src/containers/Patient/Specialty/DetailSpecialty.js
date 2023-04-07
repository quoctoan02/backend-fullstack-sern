import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DetailSpecialty.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialty, handleGetAllcodeApi } from '../../../services/userService';
import _ from 'lodash';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorIds: [],
            listProvinces: [],
            detailSpecialty: '',
            currentSpecialtyId: '',
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            this.setState({
                currentSpecialtyId: this.props.match.params.id,
            });
            let res = await getDetailSpecialty(this.props.match.params.id, 'ALL');
            if (res && res.errCode === 0) {
                console.log(res);
                this.setState({
                    detailSpecialty: res.data,
                    doctorIds: res.data.doctorIds,
                    listProvinces: res.data.listProvinces,
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {}

    handleChangeProvince = async (event) => {
        let res = await getDetailSpecialty(this.state.currentSpecialtyId, event.target.value);
        if (res && res.errCode === 0) {
            this.setState({
                detailSpecialty: res.data,
                doctorIds: res.data.doctorIds,
                listProvinces: res.data.listProvinces,
            });
        }
    };

    render() {
        let { doctorIds, detailSpecialty, listProvinces } = this.state;
        let { language } = this.props;
        return (
            <div className="detail-specialty-container">
                <HomeHeader isShowBanner={false} />{' '}
                <div className="detail-specialty-background ">
                    <div className="detail-specialty-description">
                        {detailSpecialty && !_.isEmpty(detailSpecialty) && (
                            <div
                                className="container"
                                dangerouslySetInnerHTML={{
                                    __html: detailSpecialty.descriptionHTML,
                                }}
                            ></div>
                        )}
                    </div>
                </div>
                <div className="detail-specialty-body">
                    <div className="filter-doctor-by-province container-md">
                        {' '}
                        <select
                            className="select-province form-select"
                            onClick={(event) => this.handleChangeProvince(event)}
                            defaultValue={'ALL'}
                        >
                            <option
                                selected
                                value={'ALL'}
                            >
                                {language === LANGUAGES.VI ? 'Toàn quốc' : 'Nationwide'}
                            </option>
                            {listProvinces &&
                                listProvinces.length > 0 &&
                                listProvinces.map((item, index) => {
                                    return (
                                        <option
                                            key={index}
                                            value={item.provinceId}
                                        >
                                            {language === LANGUAGES.VI
                                                ? item.provinceData.valueVi
                                                : item.provinceData.valueEn}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                    <div className="detail-specialty-content container-md">
                        {doctorIds &&
                            doctorIds.length > 0 &&
                            doctorIds.map((item, index) => {
                                return (
                                    <div
                                        className="each-doctor"
                                        key={index}
                                    >
                                        <div className="detail-specialty-content-left">
                                            <div className="profile-doctor">
                                                <ProfileDoctor
                                                    doctorId={item.doctorId}
                                                    isShowDescription={true}
                                                    isShowLinkDetail={true}
                                                    isHidePrice={true}
                                                />
                                            </div>
                                        </div>

                                        <div className="detail-specialty-content-right">
                                            <div className="doctor-schedule">
                                                <DoctorSchedule
                                                    doctorIdFromParent={item.doctorId}
                                                />
                                            </div>
                                            <div className="doctor-extra-info">
                                                <DoctorExtraInfo
                                                    doctorIdFromParent={item.doctorId}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
