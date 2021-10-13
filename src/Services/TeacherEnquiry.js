import axios from "axios";
import { serverUrl } from './Url';

const url = `${serverUrl}/teacherEnquiry`




export const newEnquiry=async(obj)=>{
    return axios.post(`${url}/enquireNow`,obj)
}

