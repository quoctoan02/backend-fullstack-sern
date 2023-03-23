import React, { Component } from 'react';
import { connect } from 'react-redux';
import './VerifyEmail.scss';
import HomeHeader from '../HomePage/HomeHeader';

import { LANGUAGES } from '../../utils';
import { FormattedMessage } from 'react-intl';
import { verifyBookingAppointment } from '../../services/userService';
class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: -1,
        };
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            const urlParams = new URLSearchParams(this.props.location.search);
            const token = urlParams.get('token');
            const doctorId = urlParams.get('doctorId');
            let res = await verifyBookingAppointment({
                token,
                doctorId,
            });
            if (res) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode,
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {}

    render() {
        let { statusVerify, errCode } = this.state;
        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div className="verify-email-container">
                    {!statusVerify ? (
                        <div>Loading...</div>
                    ) : (
                        <div>
                            {+errCode === 0 ? (
                                <div className="info-booking confirm-success">
                                    Xác nhận lịch hẹn thành công
                                </div>
                            ) : (
                                <div className="info-booking confirm-failed">
                                    Lịch hẹn đã được xác nhận hoặc không tồn tại
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
