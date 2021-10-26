import axios from "axios";
import { serverUrl } from './Url'


const url = `${serverUrl}/subject`


export const getAllSubjects = async () => {
    return axios.get(`${url}/`)
}
