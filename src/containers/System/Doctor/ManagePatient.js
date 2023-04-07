import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManagePatient.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import DatePicker from '../../../components/Input/DatePicker';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { toast } from 'react-toastify';
import _ from 'lodash';
import moment from 'moment';
import { getListPatient } from '../../../services/userService';
import PrescriptionModal from './PrescriptionModal';
import { postSendPrescription } from '../../../services/userService';
import LoadingOverlay from 'react-loading-overlay';
class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            listPatient: [],
            isOpenPrescriptionModal: false,
            dataModal: '',
            isLoading: false,
        };
    }

    async componentDidMount() {
        this.getListPatient();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {}

    getListPatient = async () => {
        let date = moment(this.state.selectedDate).format('YYYY-MM-DD');
        let doctorId = this.props.userInfo.id;
        let res = await getListPatient(doctorId, date);
        console.log(res);
        if (res && res.errCode === 0) {
            this.setState({ listPatient: res.data });
        }
    };
    handleOnChangeDatePicker = (date) => {
        this.setState({ selectedDate: date[0] }, () => {
            this.getListPatient();
        });
    };

    handleOpenPrescriptionModal = (item) => {
        let timeBooking = this.buildTimeBooking(item);
        let data = {
            bookingId: item.id,
            email: item.patientData.email,
            patientName: item.patientData.fullName,
            timeBooking,
        };
        this.setState({
            isOpenPrescriptionModal: true,
            dataModal: data,
        });
    };

    closePrescriptionModal = () => {
        this.setState({ isOpenPrescriptionModal: false, dataModal: {} });
    };

    sendPrescription = async (data) => {
        this.setState({
            isLoading: true,
        });
        let res = await postSendPrescription(data);
        if (res && res.errCode === 0) {
            this.setState({
                isLoading: false,
            });
            toast.success('Send prescription successfully');
            await this.getListPatient();
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
                    ? dataTime.timeTypeBooking.valueVi
                    : dataTime.timeTypeBooking.valueEn;
            let date =
                language === LANGUAGES.VI
                    ? moment(dataTime.date).format('dddd - DD/MM/YYYY')
                    : moment(dataTime.date).locale('en').format('ddd - DD/MM/YYYY');
            return `${time} - ${this.capitalizeFirstLetter(date)}`;
        }
        return '';
    };
    render() {
        let { listPatient, isLoading } = this.state;
        let { language } = this.props;
        return (
            <React.Fragment>
                <LoadingOverlay
                    active={isLoading}
                    spinner
                    text="Loading..."
                >
                    <div className="manage-patient-container">
                        <div className="m-p-title">Manage Patient</div>
                        <div className="m-p-body">
                            <div className="row">
                                <div className="col-3 mb-3">
                                    <label>Chon ngay kham</label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className="form-control"
                                        value={this.state.selectedDate}
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <table id="customers">
                                        <tbody>
                                            <tr>
                                                <th>STT</th>
                                                <th>Thời gian</th>
                                                <th>Họ tên</th>
                                                <th>Số điện thoại</th>
                                                {/* <th>Ngày sinh</th>
                                            <th>Giới tính</th>
                                           */}{' '}
                                                <th>Địa chỉ</th>
                                                <th>Lí do khám</th>
                                                {/* <th>Tiền sử bệnh</th> */}
                                                <th>Action</th>
                                            </tr>

                                            {listPatient && listPatient.length > 0 ? (
                                                listPatient.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                {language === LANGUAGES.VI
                                                                    ? item.timeTypeBooking.valueVi
                                                                    : item.timeTypeBooking.valueEn}
                                                            </td>
                                                            <td>{item.patientData.fullName}</td>
                                                            <td>{item.patientData.phoneNumber}</td>
                                                            {/* <td>{item.patientData.birthday}</td>
                                                        <td>
                                                            {item.patientData.genderPatient.valueVi}
                                                        </td>
                                                        */}
                                                            <td>{item.patientData.address}</td>
                                                            <td>{item.patientData.reason}</td>
                                                            {/* <td>{item.patientData.illnessHistory}</td> */}
                                                            <td>
                                                                <button
                                                                    className="btn-confirm btn btn-warning"
                                                                    onClick={() =>
                                                                        this.handleOpenPrescriptionModal(
                                                                            item
                                                                        )
                                                                    }
                                                                >
                                                                    Đã khám xong
                                                                </button>

                                                                <button
                                                                    className="btn btn-info"
                                                                    onClick={() =>
                                                                        this.handleSendPrescription()
                                                                    }
                                                                >
                                                                    Xem chi tiet
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="6">No data</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <PrescriptionModal
                        isOpenModal={this.state.isOpenPrescriptionModal}
                        dataModal={this.state.dataModal}
                        closeModal={this.closePrescriptionModal}
                        sendPrescription={this.sendPrescription}
                    />
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
