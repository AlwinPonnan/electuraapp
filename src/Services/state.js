import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

const url = `${serverUrl}/state`




export const getAllStates=async()=>{
    return axiosApiInstance.get(`${url}/`)
}

