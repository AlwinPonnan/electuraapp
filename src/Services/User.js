import axios from "axios";
import { serverUrl } from './Url';
import jwt_decode from "jwt-decode";
import EncryptedStorage from 'react-native-encrypted-storage';

const otpApiKey = "25b77411-d03e-11eb-8089-0200cd936042"
const url = `${serverUrl}/users`


export const setToken = async (token) => {
    return await EncryptedStorage.setItem('AUTH_TOKEN', token)
}
export const getToken = async () => {
    return await EncryptedStorage.getItem('AUTH_TOKEN')
}
export const removeToken = async () => {
    return await EncryptedStorage.removeItem('AUTH_TOKEN')
}

export const getDecodedToken = async () => {
    let token = await getToken()
    if (!token)
        return null
    let val = jwt_decode(token)
    return val
}


export const registerUser = (obj) => {
    try {
        let res = axios.post(`${url}/register`, obj)
        return res
    }
    catch (err) {
        throw (err)
    }
}


export const loginUser = (obj) => {
    try {
        let res = axios.post(`${url}/login`, obj)
        return res
    }
    catch (err) {
        throw (err)
    }
}



export const getUser = async () => {
    try {
        let token = await getDecodedToken()
        let res = axios.get(`${url}/getById/${token.userId}`)
        return res
    }
    catch (err) {
        throw (err)
    }
}

export const updateProfile = async (obj) => {
    try {
        let token = await getDecodedToken()
        let res = axios.patch(`${url}/updateById/${token.userId}`, obj)
        return res
    }
    catch (err) {
        throw (err)
    }
}

export const updateProfileImage = async (obj) => {
    try {
        let token = await getDecodedToken()
        let res = axios.patch(`${url}/updateImage/${token.userId}`, obj)
        return res
    }
    catch (err) {
        throw (err)
    }
}





export const SendOtp = (phone) => {
    try {
        return axios.get(`https://2factor.in/API/V1/${otpApiKey}/SMS/+91${phone}/AUTOGEN`)
    } catch (error) {
        console.error(error)
        throw (error)
    }
}


export const CheckValidOtp = (sessionId, otp) => {
    try {
        return axios.get(`https://2factor.in/API/V1/${otpApiKey}/SMS/VERIFY/${sessionId}/${otp}`)

    } catch (error) {
        console.error(error)
        throw (error)
    }
}


