import axios from "axios";
import { serverUrl } from './Url'


const url = `${serverUrl}/classes`


export const getAllClasses = async () => {
    return axios.get(`${url}/`)
}
