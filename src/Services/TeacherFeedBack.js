import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

const url = `${serverUrl}/teacherFeedBack`

export const addNewFeedBack = async (formData) => {
    return axiosApiInstance.post(`${url}/newFeedBack`, formData)
}


export const getAllFeedBacksByTeacherId = async (id) => {
    return axiosApiInstance.get(`${url}/getAllFeedBacksByTeacherId/${id}`)
}




