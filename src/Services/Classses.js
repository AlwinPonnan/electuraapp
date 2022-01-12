import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url'


const url = `${serverUrl}/classes`


export const getAllClasses = async () => {
    return axiosApiInstance.get(`${url}/`)
}


export const getBySubjectId=async(id)=>{
    return axiosApiInstance.get(`${url}/getBySubjectId/${id}`)
}

export const getAllBySubject=async()=>{
    return axiosApiInstance.get(`${url}/getByAllSubjects`)
}
export const getAllNestedCategories=async()=>{
    return axiosApiInstance.get(`${url}/getAllNestedCategories`)
}
