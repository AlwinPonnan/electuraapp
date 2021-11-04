import axios from "axios";
import { serverUrl } from './Url'
import { getDecodedToken } from './User'

const url = `${serverUrl}/chat`



export const getAllChats=()=>{
    return axios.get(`${url}/getChatsForUser`)
}


