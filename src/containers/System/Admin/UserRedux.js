import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserRedux.scss';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import * as actions from '../../../store/actions';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            roleIdArr: [],
            positionArr: [],
            previewImageUrl: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            actions: '',
            userId: '',
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
            });
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
            });
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
            });
        }

        if (prevProps.arrUsers !== this.props.arrUsers) {
            let arrPositions = this.props.positionRedux;
            let arrRoles = this.props.roleRedux;
            let arrGenders = this.props.genderRedux;

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                avatar: '',
                previewImageUrl: '',
                action: CRUD_ACTIONS.CREATE,
            });
        }
    }

    componentDidMount() {
        this.props.getRoleStart();
        this.props.getGenderStart();
        this.props.getPositionStart();
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            const objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImageUrl: objectUrl,
                avatar: base64,
            });
        }
    };

    openPreviewImage = () => {
        if (this.state.previewImageUrl) {
            this.setState({ isOpen: true });
        }
    };

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState(
            {
                ...copyState,
            },
            () => {}
        );
    };

    checkValidInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'address', 'phoneNumber'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('Missing parameter:' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    };

    handleSaveUser = () => {
        let isValid = this.checkValidInput();
        let { action } = this.state;
        if (isValid) {
            let {
                userId,
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                address,
                gender,
                position,
                role,
                avatar,
            } = this.state;

            if (action !== CRUD_ACTIONS.EDIT) {
                let userData = {
                    avatar,
                    email,
                    password,
                    firstName,
                    lastName,
                    phoneNumber,
                    address,
                    gender,
                    position,
                    role,
                };
                this.props.createNewUserRedux(userData);
            } else {
                let userData = {
                    id: userId,
                    avatar,
                    firstName,
                    lastName,
                    phoneNumber,
                    address,
                    gender,
                    position,
                    role,
                };
                console.log(userData);
                this.props.editUserRedux(userData);
            }
        } else {
            console.log('Not valid user');
        }
    };

    handleEditUserFromParent = (user) => {
        let {
            id,
            email,
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            positionId,
            roleId,
            image,
        } = user;
        let imageBase64 = '';
        if (image) {
            imageBase64 = Buffer.from(image, 'base64').toString('binary');
        }
        this.setState({
            avatar: '',
            email,
            password: '12345678',
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            position: positionId,
            role: roleId,
            previewImageUrl: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userId: id,
        });
    };

    render() {
        let {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            position,
            role,
            action,
        } = this.state;
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let { language, isLoadingGender } = this.props;
        console.log(this.props.arrUsers);
        return (
            <div className="user-redux-container">
                <div className="title">User Redux</div>
                <div className="user-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 my-3">
                                <FormattedMessage id="system.user-manage.add-new-user" />
                            </div>
                            <div className="col-12">
                                {isLoadingGender === true ? 'Loading genders' : ''}
                            </div>

                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="system.user-manage.email" />
                                </label>
                                <input
                                    className="form-control"
                                    type="email"
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    value={email}
                                    disabled={action === CRUD_ACTIONS.EDIT}
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="system.user-manage.password" />
                                </label>
                                <input
                                    className="form-control"
                                    type="password"
                                    onChange={(event) =>
                                        this.handleOnChangeInput(event, 'password')
                                    }
                                    value={password}
                                    disabled={action === CRUD_ACTIONS.EDIT}
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="system.user-manage.first-name" />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    onChange={(event) =>
                                        this.handleOnChangeInput(event, 'firstName')
                                    }
                                    value={firstName}
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="system.user-manage.last-name" />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    onChange={(event) =>
                                        this.handleOnChangeInput(event, 'lastName')
                                    }
                                    value={lastName}
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="system.user-manage.mobile" />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    onChange={(event) =>
                                        this.handleOnChangeInput(event, 'phoneNumber')
                                    }
                                    value={phoneNumber}
                                />
                            </div>
                            <div className="col-9">
                                <label>
                                    <FormattedMessage id="system.user-manage.address" />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    value={address}
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="system.user-manage.gender" />
                                </label>
                                <select
                                    className="form-control"
                                    onChange={(event) => this.handleOnChangeInput(event, 'gender')}
                                    value={gender}
                                >
                                    {genders &&
                                        genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option
                                                    value={item.keyMap}
                                                    key={index}
                                                >
                                                    {language === LANGUAGES.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="system.user-manage.position" />
                                </label>
                                <select
                                    className="form-control"
                                    onChange={(event) =>
                                        this.handleOnChangeInput(event, 'position')
                                    }
                                    value={position}
                                >
                                    {positions &&
                                        positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={item.keyMap}
                                                >
                                                    {language === LANGUAGES.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="system.user-manage.role-id" />
                                </label>
                                <select
                                    className="form-control"
                                    onChange={(event) => this.handleOnChangeInput(event, 'role')}
                                    value={role}
                                >
                                    {roles &&
                                        roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={item.keyMap}
                                                >
                                                    {language === LANGUAGES.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="system.user-manage.image" />
                                </label>
                                <div className="preview-img-container">
                                    <input
                                        type="file"
                                        id="previewImg"
                                        hidden
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    />
                                    <label
                                        htmlFor="previewImg"
                                        className="label-upload"
                                    >
                                        Load image
                                        <i className="fas fa-upload"></i>
                                    </label>
                                    <div
                                        className="preview-image"
                                        style={{
                                            backgroundImage: `url('${this.state.previewImageUrl}')`,
                                        }}
                                        onClick={() => this.openPreviewImage()}
                                    />{' '}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 my-3">
                            <button
                                className={
                                    action === CRUD_ACTIONS.EDIT
                                        ? 'btn btn-warning'
                                        : 'btn btn-primary'
                                }
                                onClick={() => this.handleSaveUser()}
                            >
                                {action === CRUD_ACTIONS.EDIT ? (
                                    <FormattedMessage id="common.edit" />
                                ) : (
                                    <FormattedMessage id="common.save" />
                                )}
                            </button>
                        </div>
                        <div className="col-12 mb-5">
                            <TableManageUser
                                handleEditUserFromParent={this.handleEditUserFromParent}
                                action={this.state.action}
                            />
                        </div>
                    </div>
                </div>
                {this.state.isOpen && (
                    <Lightbox
                        mainSrc={this.state.previewImageUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        arrUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUserRedux: (data) => dispatch(actions.createNewUser(data)),
        editUserRedux: (data) => dispatch(actions.editUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
