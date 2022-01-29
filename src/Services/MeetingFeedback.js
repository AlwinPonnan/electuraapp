import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

const url = `${serverUrl}/MeetingFeedback`

export const newMeetingFeedback = async (formData) => {
    return axiosApiInstance.post(`${url}/newFeedback`, formData)
}
