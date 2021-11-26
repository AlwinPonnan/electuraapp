import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

const url = `${serverUrl}/coupons`




export const getCouponsByTeacherId = async () => {
    return axiosApiInstance.get(`${url}/getByTeacherId`)
}


export const newCoupon = async (obj) => {
    return axiosApiInstance.get(`${url}/newCoupon`, obj)
}
