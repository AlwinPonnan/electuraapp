import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

const url = `${serverUrl}/category`




export const getAllCategory=async()=>{
    return axiosApiInstance.get(`${url}/getAllCategories`)
}

