import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

const url = `${serverUrl}/courseFeedback`

export const newCourseFeedback = async (formData) => {
    return axiosApiInstance.post(`${url}/newFeedback`, formData)
}
