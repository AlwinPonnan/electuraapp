import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

const url = `${serverUrl}/area`




export const getAllAreas=async()=>{
    return axiosApiInstance.get(`${url}/`)
}

export const getByCityId=async(id)=>{
    return axiosApiInstance.get(`${url}/getAreaByCityId/${id}`)
}

