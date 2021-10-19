import axios from "axios";
import { serverUrl } from './Url';

const url = `${serverUrl}/course`

export const courseAdd=async(formData)=>{
    return axios.post(`${url}`,formData)
}


export const getAllCourses=async()=>{
    return axios.get(`${serverUrl}/`)
}


export const getAllForUsersHomePage=async()=>{
    return axios.get(`${url}/getAllForUsersHomePage`)
}


export const getById=async(id)=>{
    return axios.get(`${url}/getById/${id}`)
}
