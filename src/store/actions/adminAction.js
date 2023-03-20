import actionTypes from './actionTypes';
import {
    handleGetAllcodeApi, handleCreateNewUserApi,
    handleGetAllUsersApi, handleDeleteUserApi, handleEditUserApi,
    getTopDoctorHomeService, getAllDoctors, saveDetailDoctorApi
} from '../../services/userService';
import { toast } from 'react-toastify';

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START,
            })
            let res = await handleGetAllcodeApi('gender');
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFail());

            }
        } catch (error) {
            dispatch(fetchGenderFail());
            console.log('fetchGenderFail', error);
        }
    }
}

export const fetchGenderFail = () => ({
    type: actionTypes.FETCH_GENDER_FAILED,
})

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await handleGetAllcodeApi('position');
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFail());

            }
        } catch (error) {
            dispatch(fetchPositionFail());
            console.log('fetchPositionFail', error);
        }
    }
}

export const fetchPositionFail = () => ({
    type: actionTypes.FETCH_POSITION_FAILED,
})

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await handleGetAllcodeApi('role');
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFail());

            }
        } catch (error) {
            dispatch(fetchRoleFail());
            console.log('fetchRoleFail', error);
        }
    }
}
export const fetchRoleFail = () => ({
    type: actionTypes.FETCH_ROLE_FAILED,
})

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            console.log('createNewUser', data);
            let res = await handleCreateNewUserApi(data);
            console.log(res);
            if (res && res.errCode === 0) {
                toast.success('Create new user success')
                dispatch(createNewUserSuccess());
                dispatch(fetchAllUsersStart())
            } else {
                toast.error('Create new user failed')
                dispatch(createNewUserFail());
            }
        } catch (error) {
            toast.error(`Can't create new user`)
            dispatch(createNewUserFail());
            console.log('fetchPositionFail', error);
        }
    }
}

export const createNewUserSuccess = () => ({
    type: actionTypes.CREATE_NEW_USER_SUCCESS
})
export const createNewUserFail = () => ({
    type: actionTypes.CREATE_NEW_USER_FAILED
})

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await handleGetAllUsersApi('ALL');
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse()));
            } else {
                dispatch(fetchAllUsersFail());
            }
        } catch (error) {
            dispatch(fetchAllUsersFail());
            console.log('fetchRoleFail', error);
        }
    }
}
export const fetchAllUsersFail = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
})

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})

export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await handleDeleteUserApi(userId);
            console.log(res);
            if (res && res.errCode === 0) {
                toast.success('Delete user success')
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsersStart())
            } else {
                toast.error('Delete user failed')
                dispatch(deleteUserFail());
            }
        } catch (error) {
            toast.error('Get all users failed')
            dispatch(deleteUserFail());
            console.log('fetchPositionFail', error);
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})
export const deleteUserFail = () => ({
    type: actionTypes.EDIT_USER_FAILED
})
export const editUser = (user) => {
    return async (dispatch, getState) => {
        try {
            let res = await handleEditUserApi(user);
            console.log(res);
            if (res && res.errCode === 0) {
                toast.success('Update user success')
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart())
            } else {
                toast.error('Edit user failed')
                dispatch(editUserFail());
            }
        } catch (error) {
            toast.error('Get users failed')
            dispatch(editUserFail());
            console.log('fetchPositionFail', error);
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})
export const editUserFail = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('10');
            console.log(res)
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
                    doctorData: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
                })
            }
        } catch (error) {

        }
    }
}

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    doctors: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
                })
            }
        } catch (error) {

        }
    }
}

export const saveDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorApi(data);
            if (res && res.errCode === 0) {
                toast.success('Save detail info doctor success')
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                })
            } else {
                toast.error('Save detail info doctor failed')
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
                })
            }
        } catch (error) {
            toast.error('Save detail info doctor failed')
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
            })
        }
    }
}
export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await handleGetAllcodeApi('TIME');
            if (res && res.errCode === 0) {
                toast.success('Get allcode schedule time success')
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    timeData: res.data,
                })
            } else {
                toast.error('Get allcode schedule time error')
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
                })
            }
        } catch (error) {
            toast.error('Get allcode schedule time error')
            console.log(error)
        }
    }
}

export const getRequiredDoctorInfo = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_START,
            })
            let resPrice = await handleGetAllcodeApi('price');
            let resProvince = await handleGetAllcodeApi('province');
            let resPayment = await handleGetAllcodeApi('payment');
            if (resPrice && resPayment && resProvince &&
                resPrice.errCode === 0 && resPayment.errCode === 0 && resProvince.errCode === 0) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data
                }
                dispatch({
                    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS,
                    data,
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED,
                });
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED,
            });
            console.log('fetch', error);
        }
    }
}

