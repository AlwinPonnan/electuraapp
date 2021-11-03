import axios from "axios";
import { serverUrl } from './Url'
import { getDecodedToken } from './User'

const url = `${serverUrl}/enquiry`



export const NewEnquiry = async (FormData) => {
    let tokenObj = await getDecodedToken()
    FormData.userId = tokenObj.userId
    return axios.post(`${url}/newEnquiry/`, FormData)
}


export const getAllEnquiries = async () => {
    let tokenObj = await getDecodedToken()
    return axios.get(`${url}/getEnquiryByUserId/${tokenObj.userId}`)
}


export const getEnquiryById = async (id) => {
    return axios.get(`${url}/getById/${id}`)

}


export const sendGeneralEnquiryResponse = async (formData) => {
    return axios.post(`${url}/submitGeneralEnquiryResponse`, formData)

}


export const updateEnquiryStatusById = async (id, obj) => {
    return axios.patch(`${url}/updateEnquiryStatusById/${id}`, obj)
}


export const checkNcreateChatRoom = async (teacherId) => {
    return axios.post(`${url}/checkNcreateChatRoom/${teacherId}`)
}

