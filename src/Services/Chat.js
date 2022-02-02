import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url'
import { getDecodedToken } from './User'

const url = `${serverUrl}/chat`



export const getAllChats=()=>{
    return axiosApiInstance.get(`${url}/getChatsForUser`)
}



export const getChatHistoryByRoomId=(id,itemsPerPage,currentPage)=>{
    return axiosApiInstance.get(`${url}/getChatByChatRoomId/${id}?itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`)
}



export const readAllChatMessage=(chatRoomId)=>{
    return axiosApiInstance.patch(`${url}/readAllChatMessage/${chatRoomId}`)
}