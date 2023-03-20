import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select';
import DatePicker from '../../../components/Input/DatePicker';
import * as actions from '../../../store/actions'
import { LANGUAGES } from '../../../utils';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService'

class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: null,
            currentDate: '',
            rangeTime: []
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors()
        this.props.fetchAllScheduleTime()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors || prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allScheduleTimes !== this.props.allScheduleTimes || prevProps.language !== this.props.language) {
            let data = this.props.allScheduleTimes;
            if (data && data.length > 0) {
                data = data.map((item) => ({
                    ...item,
                    isSelected: false
                })
                )
            }
            this.setState({
                rangeTime: data,
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.firstName} ${item.lastName}`;
                let labelEn = `${item.lastName} ${item.firstName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id
                result.push(object)
            })
        }
        return result;
    }

    handleChange = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({ currentDate: date[0] })
    }

    handleSelectedTime = (time) => {
        let { rangeTime } = this.state
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) {
                    item.isSelected = !item.isSelected;
                }
                return item;
            })
        }
        this.setState({ rangeTime });
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state
        let formattedDate = new Date(currentDate).getTime().toString()
        let result = [];
        if (!currentDate) {
            toast.error('Invalid date')
            return;
        }
        if (!selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error('Invalid selected doctor')
            return;
        }

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true)
            if (selectedTime && selectedTime.length > 0) {
                selectedTime = selectedTime.map(time => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formattedDate;
                    object.timeType = time.keyMap;
                    result.push(object);
                })
            } else {
                toast.error('Invalid selected time')
                return;
            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formattedDate
        })

        if (res && res.errCode === 0) {
            toast.success('Save schedule success')
        } else {
            toast.error('error saving schedule')
            console.log(res)
        }
    }

    render() {
        let { listDoctors, selectedDoctor, currentDate, rangeTime } = this.state
        let { language } = this.props
        return (
            <React.Fragment>
                <div className='manage-schedule-container'>
                    <div className='m-s-title'>
                        <FormattedMessage id='manage-schedule.title' />
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-6'>
                                <label>
                                    <FormattedMessage id='manage-schedule.choose-doctor' />
                                </label>
                                <Select
                                    value={selectedDoctor}
                                    onChange={this.handleChange}
                                    options={listDoctors}
                                />
                            </div>
                            <div className='col-6'>
                                <label>
                                    <FormattedMessage id='manage-schedule.choose-date' />
                                </label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={currentDate}
                                    minDate={new Date().setDate(new Date().getDate() - 1)}
                                />
                            </div>
                            <div className='col-12 pick-hour-container'>
                                {
                                    rangeTime && rangeTime.length > 0 && rangeTime.map((item, index) => {
                                        return (
                                            <button className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                                key='index'
                                                onClick={() => this.handleSelectedTime(item)}
                                            >
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                            <div className='col-12'>
                                <button className='btn btn-primary btn-save-schedule'
                                    onClick={() => this.handleSaveSchedule()}
                                >
                                    <FormattedMessage id='common.save' />
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTimes: state.admin.allScheduleTimes,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
