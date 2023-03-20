import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss'
import { handleGetAllUsersApi, handleCreateNewUserApi, handleDeleteUserApi, handleEditUserApi } from '../../services/userService'
import ModalUser from './ModalUser';
import { emitter } from "../../utils/emitter"
import ModalEditUser from './ModalEditUser';
class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {},
        }
    }

    async componentDidMount() {
        await this.getAllUsers();
        //console.log(response);
    }

    getAllUsers = async () => {
        let response = await handleGetAllUsersApi('ALL');
        if (response && response.errCode === 0) {
            this.setState({ arrUsers: response.users }, () => {

            })
        }
    }
    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }

    toggleUserModal = () => {
        this.setState({ isOpenModalUser: !this.state.isOpenModalUser })

    }
    toggleEditUserModal = () => {
        this.setState({ isOpenModalEditUser: !this.state.isOpenModalEditUser })

    }

    createNewUser = async (data) => {
        try {
            console.log(data)
            let response = await handleCreateNewUserApi(data)
            if (response && response.errCode !== 0) {
                alert('Error: ' + response.errMessage);
            } else {
                await this.getAllUsers();
                this.setState({ isOpenModalUser: false });
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (error) {
            console.log(error)
        }

    }

    deleteUser = async (userId) => {
        try {
            let response = await handleDeleteUserApi(userId)
            if (response && response.errCode !== 0) {
                alert('Error: ' + response.errMessage);
            } else {
                await this.getAllUsers();
            }
        } catch (e) {
            console.log(e)
        }

    }

    handleEditUser = async (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        })
    }

    doEditUser = async (user) => {
        try {
            let response = await handleEditUserApi(user)
            if (response && response.errCode !== 0) {
                alert('Error: ' + response.errMessage);
            } else {
                await this.getAllUsers();
                this.setState({ isOpenModalEditUser: false });
                //emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        let arrUsers = this.state.arrUsers
        return (
            <div className="users-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenModalEditUser &&

                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleEditUserModal}
                        editUser={this.doEditUser}
                        currentUser={this.state.userEdit}
                    />
                }
                <div className="title text-center"> Manage users</div>
                <div className='mx-1'>
                    <button
                        className="btn btn-primary px-3"
                        onClick={() => this.handleAddNewUser()} >
                        <i className='fas fa-plus pr-1'></i>
                        Add new user
                    </button>
                </div>
                <div className='users-table mt-3 mx-1'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>

                            {arrUsers && arrUsers.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => this.handleEditUser(item)}>
                                                <i className='fas fa-pencil-alt'></i>
                                            </button>
                                            <button className='btn-delete' onClick={() => this.deleteUser(item.id)}>
                                                <i className='fas fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );

    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
