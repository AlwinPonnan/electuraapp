import axios from "axios";
import { serverUrl } from './Url'


const url = `${serverUrl}/classes`


export const getAllClasses = async () => {
    return axios.get(`${url}/`)
}


export const getBySubjectId=async(id)=>{
    return axios.get(`${url}/getBySubjectId/${id}`)
}