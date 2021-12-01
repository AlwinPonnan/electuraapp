import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url'


const url = `${serverUrl}/topic`



export const getByClassNsubjectId = async (classId, subjectId) => {
    return axiosApiInstance.get(`${url}/getByClassNsubjectId/${classId}/${subjectId}`)
}

export const getAllTopics = async () => {
    return axiosApiInstance.get(`${url}/getAllTopics`)
}
