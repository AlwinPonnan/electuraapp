import axios from "axios";
import { serverUrl } from './Url'


const url = `${serverUrl}/topic`



export const getByClassNsubjectId = async (classId, subjectId) => {
    return axios.get(`${url}/getByClassNsubjectId/${classId}/${subjectId}`)
}