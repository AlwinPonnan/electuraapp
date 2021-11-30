import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

const url = `${serverUrl}/coupons`




export const getCouponsByTeacherId = async () => {
    return axiosApiInstance.get(`${url}/getByTeacherId`)
}


export const newCoupon = async (obj) => {
    return axiosApiInstance.post(`${url}/newCoupon`, obj)
}

export const getCouponByCode = async (code) => {
    return axiosApiInstance.get(`${url}/getByCode/${code}`)
}
