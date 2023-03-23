import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BookingModal.scss';
import { LANGUAGES } from '../../../../utils';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import ProfileDoctor from '../ProfileDoctor';
import DatePicker from '../../../../components/Input/DatePicker';
import { postPatientBookAppointment } from '../../../../services/userService';
import * as actions from '../../../../store/actions';
import _ from 'lodash';
import Select from 'react-select';
import { toast } from 'react-toastify';
import moment from 'moment';
class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            doctorId: '',
            birthDay: new Date(),
            selectedGender: '',
            genders: '',
            timeType: '',
        };
    }

    async componentDidMount() {
        this.props.getGenders();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            this.props.language !== prevProps.language ||
            this.props.genders !== prevProps.genders
        ) {
            this.setState({ genders: this.buildDataGender(this.props.genders) });
        }
        if (this.props.data !== prevProps.data) {
            this.setState({
                doctorId: this.props.data.doctorId,
                timeType: this.props.data.timeType,
            });
        }
    }
    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({ ...stateCopy });
    };
    handleOnChangeDatePicker = (date) => {
        this.setState({ birthDay: date[0] });
    };
    handleSelectedGender = (gender) => {
        this.setState({ selectedGender: gender });
    };

    buildDataGender = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map((item) => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            });
        }
        return result;
    };

    handleConfirmBooking = async () => {
        //validate input
        let {
            fullName,
            phoneNumber,
            email,
            address,
            reason,
            doctorId,
            birthDay,
            gender,
            selectedGender,
            genders,
            timeType,
        } = this.state;
        let date = moment(birthDay).format('YYYY-MM-DD');
        let timeString = this.buildTimeBooking(this.props.data);
        let doctorName = this.buildDoctorName(this.props.data);
        let data = {
            doctorName,
            fullName,
            phoneNumber,
            email,
            address,
            reason,
            doctorId,
            date,
            time: timeString,
            gender,
            selectedGender: selectedGender.value,
            genders,
            timeType,
            language: this.props.language,
        };
        console.log(data);
        let res = await postPatientBookAppointment(data);
        if (res && res.errCode === 0) {
            toast.success(res.errMessage);
            this.props.closeBookingModal();
        } else {
            toast.error(res.errMessage);
        }
    };
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time =
                language === LANGUAGES.VI
                    ? dataTime.timeTypeData.valueVi
                    : dataTime.timeTypeData.valueEn;
            let date =
                language === LANGUAGES.VI
                    ? moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                    : moment
                          .unix(+dataTime.date / 1000)
                          .locale('en')
                          .format('ddd - DD/MM/YYYY');
            return `${time} - ${this.capitalizeFirstLetter(date)}`;
        }
        return '';
    };
    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name =
                language === LANGUAGES.VI
                    ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                    : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
            return name;
        }
        return '';
    };
    handleCancelBooking = () => {};
    render() {
        let { closeBookingModal, isOpenModal, data } = this.props;
        return (
            <Modal
                size="lg"
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                centered={true}
            >
                <div className={'booking-modal-content'}>
                    <div className={'booking-modal-header'}>
                        <span className="left">
                            <FormattedMessage id="patient.booking-modal.title" />
                        </span>
                        <span
                            className="right"
                            onClick={closeBookingModal}
                        >
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className={'booking-modal-body'}>
                        <div className="doctor-info">
                            <ProfileDoctor
                                doctorId={this.state.doctorId}
                                dataTime={data}
                            />
                        </div>
                        <div className="row form-booking">
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.full-name" />
                                </label>
                                <input
                                    className="form-control"
                                    value={this.state.fullName}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(event, 'fullName')
                                    }
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.phone-number" />
                                </label>
                                <input
                                    className="form-control"
                                    value={this.state.phoneNumber}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(event, 'phoneNumber')
                                    }
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Email</label>
                                <input
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.address" />
                                </label>
                                <input
                                    className="form-control"
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.reason" />
                                </label>
                                <input
                                    className="form-control"
                                    value={this.state.reason}
                                    onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.birth-day" />
                                </label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.birthDay}
                                    minDate={'today'}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.gender" />
                                </label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleSelectedGender}
                                    options={this.state.genders}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={'booking-modal-footer'}>
                        <button
                            className="btn btn-warning btn-booking-confirm"
                            onClick={() => this.handleConfirmBooking()}
                        >
                            <FormattedMessage id="patient.booking-modal.confirm" />
                        </button>
                        <button
                            className="btn btn-secondary btn-booking-cancel"
                            onClick={() => this.handleCancelBooking()}
                        >
                            <FormattedMessage id="patient.booking-modal.cancel" />
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
