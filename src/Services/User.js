import axios from "axios";
import { serverUrl } from './Url';
import jwt_decode from "jwt-decode";
import EncryptedStorage from 'react-native-encrypted-storage';
const url = `${serverUrl}/users`


export const setToken = async (token) => {
    return await EncryptedStorage.setItem('AuthToken', token)
}
export const getToken = async () => {
    return await EncryptedStorage.getItem('AuthToken')
}
export const removeToken = async () => {
    return await EncryptedStorage.removeItem('AuthToken')
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






