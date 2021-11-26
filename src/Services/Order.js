import axios from "axios";
import { serverUrl } from './Url';
import jwt_decode from "jwt-decode";
import EncryptedStorage from 'react-native-encrypted-storage';
import { axiosApiInstance } from "../../App";

const url = `${serverUrl}/order`



export const createOrder = async (obj) => {
    return await axiosApiInstance.post(`${url}/createOrder`, obj)
}

export const createSingleOrder = async (obj) => {
    return await axiosApiInstance.post(`${url}/createSingleOrder`, obj)
}



export const paymentCallBack = async (orderId) => {
    return await axiosApiInstance.get(`${url}/paymentCB/${orderId}`)
}

export const getMyOrders = async () => {
    return await axiosApiInstance.get(`${url}/getForUsers`)
}

export const getIncomingOrders = async () => {
    return await axiosApiInstance.get(`${url}/getForTeachers`)
}

export const dispatchOrder = async (id) => {
    return await axiosApiInstance.patch(`${url}/dispatch/${id}`)
}
export const dispatchImage = async (id,obj) => {
    return await axiosApiInstance.patch(`${url}/dispatchImageUpload/${id}`,obj)
}
export const deliverOrder = async (id) => {
    return await axiosApiInstance.patch(`${url}/deliver/${id}`)
}

export const getById = async (id) => {
    return await axiosApiInstance.get(`${url}/getById/${id}`)
}