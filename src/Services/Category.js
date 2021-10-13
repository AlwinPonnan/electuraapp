import axios from "axios";
import { serverUrl } from './Url';

const url = `${serverUrl}/category`




export const getAllCategory=async()=>{
    return axios.get(`${url}/getAllCategories`)
}

