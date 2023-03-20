import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DoctorSchedule.scss';
import { getScheduleByDate } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';
class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: '',
        };
    }

    async componentDidMount() {
        let allDays = this.getAllDays();
        if (allDays && allDays.length > 0) {
            let res = await getScheduleByDate(this.props.doctorIdFromParent, allDays[0].value);
            if (res && res.errCode === 0) {
                this.setState({
                    allDays: allDays,
                    allAvailableTime: res.data ? res.data : [],
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let allDays = this.getAllDays();
            this.setState({
                allDays,
            });
        }
        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let allDays = this.getAllDays();
            if (allDays && allDays.length > 0) {
                let res = await getScheduleByDate(this.props.doctorIdFromParent, allDays[0].value);
                if (res && res.errCode === 0) {
                    this.setState({
                        allAvailableTime: res.data ? res.data : [],
                    });
                }
            }
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getAllDays = () => {
        let { language } = this.props;
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            let labelDate = '';
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let today = moment(new Date()).format('DD/MM');
                    labelDate = `Hôm nay - ${today}`;
                } else {
                    labelDate = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                }
            } else {
                if (i === 0) {
                    let today = moment(new Date()).locale('en').format('DD/MM');
                    labelDate = `Today - ${today}`;
                } else {
                    labelDate = moment(new Date())
                        .add(i, 'days')
                        .locale('en')
                        .format('dddd - DD/MM');
                }
            }
            object.label = this.capitalizeFirstLetter(labelDate);
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }
        return allDays;
    };

    handleOnChangeSelectDate = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let date = event.target.value;
            let res = await getScheduleByDate(this.props.doctorIdFromParent, date);
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data,
                });
            }
        }
    };

    handleCLickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time,
        });
    };
    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false,
        });
    };
    render() {
        let { language } = this.props;
        let { allDays, allAvailableTime } = this.state;
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select onChange={(event) => this.handleOnChangeSelectDate(event)}>
                            {allDays &&
                                allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option
                                            key={index}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                    <div className="all-available-time">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt">
                                <span>
                                    <FormattedMessage id="patient.detail-doctor.schedule" />
                                </span>
                            </i>
                        </div>
                        <div className="time-content">
                            {allAvailableTime && allAvailableTime.length === 0 ? (
                                <div className="null-schedule">
                                    <FormattedMessage id="patient.detail-doctor.null-schedule" />
                                </div>
                            ) : (
                                <>
                                    <div className="time-content-button">
                                        {allAvailableTime.map((item, index) => {
                                            return (
                                                <button
                                                    onClick={() =>
                                                        this.handleCLickScheduleTime(item)
                                                    }
                                                    key={index}
                                                    className={
                                                        language === LANGUAGES.VI
                                                            ? 'btn-vi'
                                                            : 'btn-en'
                                                    }
                                                >
                                                    {language === LANGUAGES.VI
                                                        ? item.timeTypeData.valueVi
                                                        : item.timeTypeData.valueEn}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="book-free">
                                        <span className="">
                                            <FormattedMessage id="patient.detail-doctor.choose" />
                                            <i className="fa-regular fa-hand-pointer"></i>
                                            <FormattedMessage id="patient.detail-doctor.book-free" />
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal={this.state.isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal}
                    data={this.state.dataScheduleTimeModal}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
