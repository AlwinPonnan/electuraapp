import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url'
import { getDecodedToken } from './User'

const url = `${serverUrl}/GeneralFeedback`



export const newGeneralFeedback = async (FormData) => {
    return axiosApiInstance.post(`${url}/newFeedback/`, FormData)
}
