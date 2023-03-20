import axios from '../axios';

const handleLoginApi = (email, password) => {
    return axios.post('api/login', { email, password });
};

const handleGetAllUsersApi = (userId) => {
    return axios.get(`api/get-all-users?id=${userId}`);
};

const handleCreateNewUserApi = (data) => {
    return axios.post('api/create-new-user', data);
};

const handleDeleteUserApi = (userId) => {
    return axios.delete(`api/delete-user`, { data: { id: userId } });
};

const handleEditUserApi = (userData) => {
    return axios.put(`api/edit-user`, userData);
};

const handleGetAllcodeApi = (typeInput) => {
    return axios.get(`api/allcodes?type=${typeInput}`);
};

const getTopDoctorHomeService = (limit) => {
    return axios.get(`api/top-doctor-home?limit=${limit}`);
};
const getAllDoctors = () => {
    return axios.get(`api/get-all-doctors`);
};
const saveDetailDoctorApi = (data) => {
    return axios.post(`api/save-info-doctor`, data);
};

const getDetailInfoDoctor = (doctorId) => {
    return axios.get(`api/get-detail-doctor?id=${doctorId}`);
};

const saveBulkScheduleDoctor = (data) => {
    return axios.post(`api/bulk-create-schedule`, data);
};
const postPatientBookAppointment = (data) => {
    return axios.post(`api/patient-book-appointment`, data);
};

let getScheduleByDate = (doctorId, date) => {
    return axios.get(`api/get-schedule-by-date?doctorId=${doctorId}&date=${date}`);
};

const getExtraDoctorInfo = (doctorId) => {
    return axios.get(`api/get-extra-doctor-info?doctorId=${doctorId}`);
};
const getProfileDoctor = (doctorId) => {
    return axios.get(`api/get-profile-doctor?doctorId=${doctorId}`);
};

export {
    handleLoginApi,
    handleGetAllUsersApi,
    handleCreateNewUserApi,
    handleDeleteUserApi,
    handleEditUserApi,
    handleGetAllcodeApi,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctorApi,
    getDetailInfoDoctor,
    saveBulkScheduleDoctor,
    getScheduleByDate,
    getExtraDoctorInfo,
    getProfileDoctor,
    postPatientBookAppointment,
};
