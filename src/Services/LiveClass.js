import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url'
import { getDecodedToken } from './User'

const url = `${serverUrl}/liveClass`



export const getByUser = () => {
    return axiosApiInstance.get(`${url}/getLiveClassByUserId`)
}

