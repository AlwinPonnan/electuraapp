import axios from "axios";
import { serverUrl } from './Url';
import jwt_decode from "jwt-decode";
import EncryptedStorage from 'react-native-encrypted-storage';
import { axiosApiInstance } from "../../App";

const otpApiKey = "c563ebaa-c079-11eb-8089-0200cd936042"
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
        let res = axiosApiInstance.post(`${url}/register`, obj)
        return res
    }
    catch (err) {
        throw (err)
    }
}


export const loginUser = (obj) => {
    let res = axiosApiInstance.post(`${url}/login`, obj)
    return res

}



export const getUser = async () => {
    try {
        let token = await getDecodedToken()
        let res = axiosApiInstance.get(`${url}/getById/${token?.userId}`)
        return res
    }
    catch (err) {
        throw (err)
    }
}

export const referalSubmit = async (obj) => {
    return await axiosApiInstance.post(`${url}/referalCodeSubmit`, obj)
}

export const updateProfile = async (obj) => {
    try {
        let token = await getDecodedToken()
        let res = axiosApiInstance.patch(`${url}/updateById/${token?.userId}`, obj)
        return res
    }
    catch (err) {
        throw (err)
    }
}


export const updateBackgroundProfile = async (obj) => {
    let token = await getDecodedToken()
    let res = axiosApiInstance.patch(`${url}/updateById/${token?.userId}`, obj)
    return res
}

export const updateProfileImage = async (obj) => {
    try {
        let token = await getDecodedToken()
        console.log(token)
        let res = axiosApiInstance.patch(`${url}/updateImage/${token.userId}`, obj)
        return res
    }
    catch (err) {
        throw (err)
    }
}





export const SendOtp = (phone) => {
    try {
        return axiosApiInstance.get(`https://2factor.in/API/V1/${otpApiKey}/SMS/+91${phone}/AUTOGEN`)
    } catch (error) {
        console.error(error)
        throw (error)
    }
}


export const CheckValidOtp = async (sessionId, otp) => {
    try {
        return axiosApiInstance.get(`https://2factor.in/API/V1/${otpApiKey}/SMS/VERIFY/${sessionId}/${otp}`)

    } catch (error) {
        console.error(error, "error")
        throw (error)
    }
}

export const updateTeacherSlots = async (obj) => {
    return axiosApiInstance.patch(`${url}/updateTeacherSlots`, obj)
}

export const getAllTeachers = async () => {
    try {
        return axiosApiInstance.get(`${url}/getAllTeachers`)
    } catch (error) {
        console.error(error)
    }
}



export const getAllTeachersSubjectWise = async () => {
    return await axiosApiInstance.get(`${url}/getAllTeachersSubjectWise`)
}
export const getAllTeachersClassWiseBySubjectId = async (id) => {
    return await axiosApiInstance.get(`${url}/getAllTeachersClassWiseBySubjectId/${id}`)
}


export const saveTokenToDatabase = async (token) => {
    try {
        let tokenD = await getDecodedToken()
        return await axiosApiInstance.post(`${url}/registerUserFcmToken`, { token, userId: tokenD?.userId })
    } catch (error) {
        console.error(error)
        throw (error)
    }
}


export const getById = async (id) => {
    return await axiosApiInstance.get(`${url}/getById/${id}`)
}
export const updateProfileVisit = async (id) => {
    return await axiosApiInstance.patch(`${url}/updateProfileVisit/${id}`)
}

export const addTOWishList = async (obj) => {
    return await axiosApiInstance.post(`${url}/addToWishlist`, obj)
}
export const getWishlist = async () => {
    return await axiosApiInstance.get(`${url}/getWishlist`)
}
export const removeFromWishlist = async (id) => {
    return await axiosApiInstance.delete(`${url}/removeFromWishlist/${id}`)
}

export const BookmarkTeacher = async (id) => {
    return await axiosApiInstance.post(`${url}/bookmarkTeacher/${id}`)
}


export const addToCart = async (obj) => {
    return await axiosApiInstance.post(`${url}/addToCart`, obj)
}
export const getCart = async () => {
    return await axiosApiInstance.get(`${url}/getCart`)
}
export const removeFromCart = async (id) => {
    return await axiosApiInstance.delete(`${url}/removeFromCart/${id}`)
}



export const getAllNotifications = async () => {
    let tokenD = await getDecodedToken()

    return await axiosApiInstance.get(`${url}/getNotifications/${tokenD?.userId}`)
}

export const getAllNotificationsPageWise = async (itemsPerPage,currentPage) => {
    let tokenD = await getDecodedToken()
    return await axiosApiInstance.get(`${url}/getNotificationsPageWise/${tokenD?.userId}?itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`)
}






export const toggleOnline = async () => {
    return await axiosApiInstance.patch(`${url}/toggleOnline`)
}

export const handleIntroFileUpload = async (formData) => {
    return await axiosApiInstance.patch(`${url}/updateIntroData`, formData)
}

export const markNotificationAsRead = async (id) => {
    return await axiosApiInstance.patch(`${url}/markNotificationAsRead/${id}`)
}


export const techerSlotSelect = async (obj) => {
    return await axiosApiInstance.post(`${url}/submitslotArr`, obj)
}