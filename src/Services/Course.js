import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

const url = `${serverUrl}/course`

export const courseAdd = async (formData) => {
    return axiosApiInstance.post(`${url}`, formData)
}


export const getAllCourses = async () => {
    return axiosApiInstance.get(`${serverUrl}/`)
}


export const getAllForUsersHomePage = async () => {
    return axiosApiInstance.get(`${url}/getAllForUsersHomePage`)
}

export const getAllCoursesSubjectWise = async () => {
    return axiosApiInstance.get(`${url}/getAllCoursesSubjectWise`)
}

export const getAllCoursesSubjectWiseClass = async (id) => {
    return axiosApiInstance.get(`${url}/getAllCoursesSubjectWiseClass/${id}`)
}



export const getByCoursesUserId = async (id) => {
    return axiosApiInstance.get(`${url}/getByUserId/${id}`)
}


export const getById = async (id) => {
    return axiosApiInstance.get(`${url}/getById/${id}`)
}
export const uploadCourseImage = async (id, obj) => {
    return axiosApiInstance.patch(`${url}/uploadCourseImage/${id}`, obj)
}

export const toggleCourse = async (id,obj) => {
    return axiosApiInstance.patch(`${url}/toggleCourse/${id}`, obj)
}



