/* eslint-disable array-callback-return */
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./ManageDoctor.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import { getDetailInfoDoctor } from "../../../services/userService";

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: "",
            contentHTML: "",
            selectedDoctor: "",
            description: "",
            listDoctors: [],
            hasOldData: false,

            listPrice: [],
            listPayments: [],
            listProvinces: [],
            selectedPrice: "",
            selectedProvince: "",
            selectedPayment: "",
            nameClinic: "",
            addressClinic: "",
            note: "",
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getRequiredDoctorInfo();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            prevProps.allDoctors !== this.props.allDoctors ||
            prevProps.language !== this.props.language
        ) {
            let dataSelect = this.buildDataInputSelect(
                this.props.allDoctors,
                "USER"
            );
            this.setState({
                listDoctors: dataSelect,
            });
        }

        if (
            prevProps.allRequiredDoctorInfo !==
                this.props.allRequiredDoctorInfo ||
            prevProps.language !== this.props.language
        ) {
            let dataSelectPrice = this.buildDataInputSelect(
                this.props.allRequiredDoctorInfo.resPrice,
                "PRICE"
            );
            let dataSelectPayment = this.buildDataInputSelect(
                this.props.allRequiredDoctorInfo.resPayment,
                "PAYMENT"
            );
            let dataSelectProvince = this.buildDataInputSelect(
                this.props.allRequiredDoctorInfo.resProvince,
                "PROVINCE"
            );
            this.setState({
                listPrice: dataSelectPrice,
                listPayments: dataSelectPayment,
                listProvinces: dataSelectProvince,
            });
        }
    }

    handleSaveContentMarkdown = () => {
        let {
            selectedDoctor,
            selectedPayment,
            selectedPrice,
            selectedProvince,
            nameClinic,
            addressClinic,
            note,
            contentMarkdown,
            contentHTML,
            description,
            hasOldData,
        } = this.state;
        this.props.saveDetailDoctor({
            contentMarkdown,
            contentHTML,
            doctorId: selectedDoctor.value,
            description,
            action:
                hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
            priceId: selectedPrice.value,
            paymentId: selectedPayment.value,
            provinceId: selectedProvince.value,
            nameClinic,
            addressClinic,
            note,
        });
    };

    handleChangeRequiredDoctorInfo = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy,
        });
    };

    handleChangeDoctor = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
        let { listPrice, listPayments, listProvinces } = this.state;
        let res = await getDetailInfoDoctor(selectedDoctor.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            let selectedPrice = "";
            let selectedPayment = "";
            let selectedProvince = "";
            if (res.data.Doctor_Info) {
                let Doctor_Info = res.data.Doctor_Info;
                selectedPrice = listPrice.find((item) => {
                    return item && item.value === Doctor_Info.priceId;
                });
                selectedPayment = listPayments.find((item) => {
                    return item && item.value === Doctor_Info.paymentId;
                });
                selectedProvince = listProvinces.find((item) => {
                    return item && item.value === Doctor_Info.provinceId;
                });
                this.setState({
                    addressClinic: Doctor_Info.addressClinic,
                    nameClinic: Doctor_Info.nameClinic,
                    note: Doctor_Info.note,
                    selectedPrice,
                    selectedPayment,
                    selectedProvince,
                });
            } else {
                this.setState({
                    selectedPrice: "",
                    selectedProvince: "",
                    selectedPayment: "",
                    nameClinic: "",
                    addressClinic: "",
                    note: "",
                });
            }
            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                hasOldData: true,
            });
        } else {
            this.setState({
                contentMarkdown: "",
                contentHTML: "",
                description: "",
                hasOldData: false,
            });
        }
    };

    handleEditorChange = ({ html, text }) => {
        this.setState(
            {
                contentHTML: html,
                contentMarkdown: text,
            },
            () => {}
        );
    };

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy,
        });
    };

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                if (type === "USER") {
                    let labelVi = `${item.firstName} ${item.lastName}`;
                    let labelEn = `${item.lastName} ${item.firstName}`;
                    object.label =
                        language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                }
                if (type === "PRICE") {
                    object.label =
                        language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                    object.value = item.keyMap;
                }
                if (type === "PAYMENT" || type === "PROVINCE") {
                    object.label =
                        language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                    object.value = item.keyMap;
                }
                result.push(object);
            });
        }
        return result;
    };

    render() {
        console.log(this.state);
        let {
            listDoctors,
            listProvinces,
            listPayments,
            listPrice,
            selectedDoctor,
            selectedPayment,
            selectedPrice,
            selectedProvince,
            nameClinic,
            addressClinic,
            note,
        } = this.state;
        let mdParser = new MarkdownIt(/* Markdown-it options */);
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className="more-info">
                    <div className="content-left form-group">
                        <label>
                            <FormattedMessage id="manage-schedule.choose-doctor" />
                        </label>
                        <Select
                            value={selectedDoctor}
                            onChange={this.handleChangeDoctor}
                            options={listDoctors}
                            placeholder={
                                <FormattedMessage id="manage-schedule.choose-doctor" />
                            }
                        />
                    </div>
                    <div className="content-right">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.intro" />
                        </label>
                        <textarea
                            value={this.state.description}
                            onChange={(event) =>
                                this.handleOnChangeText(event, "description")
                            }
                            className="form-control"
                        ></textarea>
                    </div>
                </div>
                <div className="more-info-extra row">
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.price" />
                        </label>
                        <Select
                            value={selectedPrice}
                            onChange={this.handleChangeRequiredDoctorInfo}
                            options={listPrice}
                            name="selectedPrice"
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.price" />
                            }
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.payment" />
                        </label>
                        <Select
                            name="selectedPayment"
                            value={selectedPayment}
                            onChange={this.handleChangeRequiredDoctorInfo}
                            options={listPayments}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.payment" />
                            }
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.province" />
                        </label>
                        <Select
                            name="selectedProvince"
                            value={selectedProvince}
                            onChange={this.handleChangeRequiredDoctorInfo}
                            options={listProvinces}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.province" />
                            }
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.name-clinic" />
                        </label>
                        <input
                            className="form-control"
                            value={nameClinic}
                            onChange={(event) =>
                                this.handleOnChangeText(event, "nameClinic")
                            }
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.address-clinic" />
                        </label>
                        <input
                            className="form-control"
                            value={addressClinic}
                            onChange={(event) =>
                                this.handleOnChangeText(event, "addressClinic")
                            }
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.note" />
                        </label>
                        <input
                            className="form-control"
                            value={note}
                            onChange={(event) =>
                                this.handleOnChangeText(event, "note")
                            }
                        />
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: "500px" }}
                        value={this.state.contentMarkdown}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                    />
                </div>
                <button
                    onClick={() => this.handleSaveContentMarkdown()}
                    className={
                        this.state.hasOldData === true
                            ? "save-content-doctor"
                            : "create-content-doctor"
                    }
                >
                    {this.state.hasOldData === false ? (
                        <span>
                            <FormattedMessage id="admin.manage-doctor.save" />
                        </span>
                    ) : (
                        <span>
                            <FormattedMessage id="admin.manage-doctor.save-changes" />
                        </span>
                    )}
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.requiredDoctorInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getRequiredDoctorInfo: () => dispatch(actions.getRequiredDoctorInfo()),
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
