import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageClinic.scss';
import { LANGUAGES, CommonUtils } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import {
    createNewClinic,
    getDetailClinic,
    handleGetAllcodeApi,
} from '../../../services/userService';
import { toast } from 'react-toastify';
import Select from 'react-select';
class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            avatar: '',
            background: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            selectedProvince: '',
            address: '',
            listProvinces: [],
            listSelectProvinces: [],
        };
    }

    async componentDidMount() {
        let res = await handleGetAllcodeApi('province');
        if (res && res.errCode === 0) {
            console.log(res);
            this.setState({
                listProvinces: res.data,
            });
        }
        // if (this.props.match && this.props.match.params && this.props.match.params.id) {
        //     this.setState({
        //         currentClinicId: this.props.match.params.id,
        //     });
        //     let res = await getDetailClinic(this.props.match.params.id, 'ALL');
        //     if (res && res.errCode === 0) {
        //         console.log(res);
        //         this.setState({
        //             detailClinic: res.data,
        //             doctorIds: res.data.doctorIds,
        //             listProvinces: res.data.listProvinces,
        //         });
        //     }
        // }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            prevState.listProvinces !== this.state.listProvinces ||
            prevProps.language !== this.props.language
        ) {
            this.setState({
                listSelectProvinces: this.buildDataInputSelect(this.state.listProvinces),
            });
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        });
    };

    handleOnChangeInput = (event, id) => {
        let copyState = this.state;
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    };

    handleOnChangeImage = async (event, name) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            console.log(base64);
            let copyState = { ...this.state };
            copyState[name] = base64;
            this.setState({ ...copyState });
        }
    };

    handleSaveNewClinic = async () => {
        let res = await createNewClinic({
            provinceId: this.state.selectedProvince.value,
            avatar: this.state.avatar,
            descriptionHTML: this.state.descriptionHTML,
            descriptionMarkdown: this.state.descriptionMarkdown,
            address: this.state.address,
            name: this.state.name,
        });
        if (res && res.errCode === 0) {
            toast.success(res.errMessage);
        } else {
            toast.error(res.errMessage);
        }
    };

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            });
        }
        return result;
    };
    handleChangeProvince = async (selectedOption) => {
        this.setState({
            selectedProvince: selectedOption,
        });
    };
    render() {
        let { listSelectProvinces, selectedProvince } = this.state;
        console.log('this.state: ', this.state);

        let mdParser = new MarkdownIt(/* Markdown-it options */);
        return (
            <div className="manage-specialty-container">
                <div className="ms-title">Quản lý phòng khám</div>
                <div className="add-new-specialty row">
                    <div className="col-8 mb-3">
                        <label className="">Tên phòng khám</label>
                        <input
                            className="form-control"
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                            value={this.state.name}
                        />
                    </div>

                    <div className="col-4 mb-3">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.province" />
                        </label>
                        <Select
                            name="selectedProvince"
                            value={selectedProvince}
                            onChange={this.handleChangeProvince}
                            options={listSelectProvinces}
                            placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <label className="">Địa chỉ chi tiết</label>
                        <input
                            className="form-control"
                            onChange={(event) => this.handleOnChangeInput(event, 'address')}
                            value={this.state.address}
                        />
                    </div>
                    <div className="col-6 mb-3">
                        <label className="">Ảnh đại diện phòng khám</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(event) => this.handleOnChangeImage(event, 'avatar')}
                        />
                    </div>
                    <div className="col-6 mb-3">
                        <label className="">Ảnh nền phòng khám</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(event) => this.handleOnChangeImage(event, 'background')}
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <MdEditor
                            style={{ height: '400px' }}
                            value={this.state.descriptionMarkdown}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => this.handleSaveNewClinic()}
                        >
                            Luu
                        </button>
                        '
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
