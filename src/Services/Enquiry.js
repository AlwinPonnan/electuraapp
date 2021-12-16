import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url'
import { getDecodedToken } from './User'

const url = `${serverUrl}/enquiry`



export const NewEnquiry = async (FormData) => {
    let tokenObj = await getDecodedToken()
    FormData.userId = tokenObj.userId
    return axiosApiInstance.post(`${url}/newEnquiry/`, FormData)
}


export const getAllEnquiries = async () => {
    let tokenObj = await getDecodedToken()
    return axiosApiInstance.get(`${url}/getEnquiryByUserId/${tokenObj.userId}`)
}
export const getAllGeneralEnquiriesForTeacher = async () => {
    let tokenObj = await getDecodedToken()
    return axiosApiInstance.get(`${url}/getAllGeneralEnquiriesForTeacher/${tokenObj.userId}`)
}

export const getAllEnquiryRequests = async () => {
    let tokenObj = await getDecodedToken()
    return axiosApiInstance.get(`${url}/getAllEnquiryRequests/${tokenObj.userId}`)
}



export const getEnquiryById = async (id) => {
    return axiosApiInstance.get(`${url}/getById/${id}`)

}


export const sendGeneralEnquiryResponse = async (formData) => {
    return axiosApiInstance.post(`${url}/submitGeneralEnquiryResponse`, formData)

}


export const updateEnquiryStatusById = async (id, obj) => {
    return axiosApiInstance.patch(`${url}/updateEnquiryStatusById/${id}`, obj)
}


export const checkNcreateChatRoom = async (teacherId, enquiryId) => {
    return axiosApiInstance.post(`${url}/checkNcreateChatRoom/${teacherId}/${enquiryId}`)
}

export const checkAndStartMeeting = async (enquiryId) => {
    return axiosApiInstance.post(`${url}/startEnquiryMeeting/${enquiryId}`)
}
export const checkExistingMeeting = async (enquiryId) => {
    return axiosApiInstance.get(`${url}/checkExistingMeeting/${enquiryId}`)
}

