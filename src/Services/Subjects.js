import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url'


const url = `${serverUrl}/subject`


export const getAllSubjects = async () => {
    return axiosApiInstance.get(`${url}/`)
}
