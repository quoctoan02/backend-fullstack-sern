import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DoctorExtraInfo.scss';
import { getExtraDoctorInfo } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { NumericFormat } from 'react-number-format';

class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfo: false,
            extraInfo: '',
        };
    }

    async componentDidMount() {
        let data = await getExtraDoctorInfo(this.props.doctorIdFromParent);
        this.setState({ extraInfo: data.data });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            prevProps.doctorIdFromParent !== this.props.doctorIdFromParent ||
            prevProps.language !== this.props.language
        ) {
            let data = await getExtraDoctorInfo(this.props.doctorIdFromParent);
            this.setState({ extraInfo: data.data });
        }
    }

    showHideDetailInfo = (status) => {
        this.setState({
            isShowDetailInfo: status,
        });
    };

    render() {
        let { language } = this.props;
        let { isShowDetailInfo, extraInfo } = this.state;
        return (
            <div className="doctor-extra-info-container">
                <div className="content-up">
                    <div className="address-text">
                        <FormattedMessage id="patient.extra-doctor-info.text-address" />
                    </div>
                    <div className="name-clinic">
                        {extraInfo && extraInfo.nameClinic ? extraInfo.nameClinic : ''}
                    </div>
                    <div className="address-detail">
                        {extraInfo && extraInfo.addressClinic ? extraInfo.addressClinic : ''}
                    </div>
                </div>

                <div className="content-down">
                    {isShowDetailInfo === false ? (
                        <div className="short-info">
                            <FormattedMessage id="patient.extra-doctor-info.text-price" /> :{' '}
                            {extraInfo && extraInfo.priceData ? (
                                language === LANGUAGES.VI ? (
                                    <NumericFormat
                                        className="currency"
                                        value={extraInfo.priceData.valueVi}
                                        displayType={'text'}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        suffix={'VND'}
                                    />
                                ) : (
                                    <NumericFormat
                                        className="currency"
                                        value={extraInfo.priceData.valueEn}
                                        displayType={'text'}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        prefix={'$'}
                                    />
                                )
                            ) : (
                                ''
                            )}
                            .
                            <span
                                className="detail"
                                onClick={() => this.showHideDetailInfo(true)}
                            >
                                <span>
                                    <FormattedMessage id="patient.extra-doctor-info.view-detail" />
                                </span>
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="title-price">
                                <FormattedMessage id="patient.extra-doctor-info.text-price" />:{' '}
                            </div>
                            <div className="detail-info">
                                <div className="price">
                                    <span className="left">
                                        <FormattedMessage id="patient.extra-doctor-info.text-price" />
                                    </span>
                                    <span className="right">
                                        {extraInfo && extraInfo.priceData ? (
                                            language === LANGUAGES.VI ? (
                                                <NumericFormat
                                                    className="currency"
                                                    value={extraInfo.priceData.valueVi}
                                                    displayType={'text'}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    suffix={'VND'}
                                                />
                                            ) : (
                                                <NumericFormat
                                                    className="currency"
                                                    value={extraInfo.priceData.valueEn}
                                                    displayType={'text'}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    prefix={'$'}
                                                />
                                            )
                                        ) : (
                                            ''
                                        )}
                                    </span>
                                </div>
                                <p
                                    className="note"
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {extraInfo && extraInfo.note ? extraInfo.note : ''}
                                </p>
                            </div>
                            <div className="payment">
                                {extraInfo && extraInfo.paymentData
                                    ? language === LANGUAGES.VI
                                        ? `Người bệnh có thể thanh toán chi phí bằng hình thức: ${extraInfo.paymentData.valueVi}`
                                        : `Patient can pay the fee by method: ${extraInfo.paymentData.valueEn}`
                                    : ''}
                            </div>
                            <div className="hide-price">
                                <span onClick={() => this.showHideDetailInfo(false)}>
                                    <FormattedMessage id="patient.extra-doctor-info.hide-price-table" />
                                </span>
                            </div>
                        </>
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
