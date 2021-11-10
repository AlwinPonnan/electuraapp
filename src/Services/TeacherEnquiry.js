import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

const url = `${serverUrl}/teacherEnquiry`




export const newEnquiry=async(obj)=>{
    return axiosApiInstance.post(`${url}/enquireNow`,obj)
}

export const uploadIdProof=async(id,obj)=>{
    return axiosApiInstance.patch(`${url}/updateIdProof/${id}`,obj)
}

export const uploadQualifications=async(id,obj)=>{
    return axiosApiInstance.patch(`${url}/updateQualificationCertificate/${id}`,obj)
}
