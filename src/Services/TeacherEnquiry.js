import axios from "axios";
import { serverUrl } from './Url';

const url = `${serverUrl}/teacherEnquiry`




export const newEnquiry=async(obj)=>{
    return axios.post(`${url}/enquireNow`,obj)
}

export const uploadIdProof=async(id,obj)=>{
    return axios.patch(`${url}/updateIdProof/${id}`,obj)
}

export const uploadQualifications=async(id,obj)=>{
    return axios.patch(`${url}/updateQualificationCertificate/${id}`,obj)
}
