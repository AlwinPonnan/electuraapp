import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

const url = `${serverUrl}/city`




export const getAllCities=async()=>{
    return axiosApiInstance.get(`${url}/`)
}

export const getByStateId=async(id)=>{
    return axiosApiInstance.get(`${url}/getByStateId/${id}`)
}
