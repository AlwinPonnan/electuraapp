import axios from "axios";
import { axiosApiInstance } from "../../App";
import { serverUrl } from './Url';

// const url = `${serverUrl}/area`



export const createZoomMeeting = async() => {
    try {
        let obj = {
            topic: "meeting",
            type: 2,
            start_time: '2021-12-16T09:37:05.412Z',
            duration: 40,
            pre_schedule: false,
            agenda: "meeting",
            timezone: "Asia/Kolkata",
            settings: {
                host_video: true,
                participant_video: true,
                waiting_room: false
            }
        }
        return await  axios.post('https://api.zoom.us/v2/users/bpandey9876@gmail.com/meetings',obj,{headers:{
            'Authorization':"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Ii1CTlMtM2R3UjB5R0JDYUlUcUI2a2ciLCJleHAiOjE2Mzk2NTIyNDgsImlhdCI6MTYzOTY0Njg0OH0.uzZeWxFSyIAC2dkTgL1nT15x99qpE_P01QXxNoA5FE8"
        }})
        } catch (error) {
            console.error(error)
        }
    }