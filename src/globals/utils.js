import { serverUrl } from "../Services/Url"
export const checkValidPhone = (phone) => {
    let tempPhone = parseInt(phone);
    let regex = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
    console.log(regex.test(phone))
    return regex.test(tempPhone)
}
export const generateImageUrl = (profilePhoto) => {
    // console.log(serverUrl, "url")
    let imageUrl = `${serverUrl}/uploads/${profilePhoto}`

    return imageUrl
}

export const sortByText = {
    popularity: "Popularity",
    priceLowToHigh: "price low to high",
    priceHighToLow: "price high to low",
    customerRating: "Customer Rating"
}

export const getQueryParams = (url) => {
    let regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
    while (match = regex.exec(url)) {
        params[match[1]] = match[2];
    }
    return params
}

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
 

export const dayArr = [
    {
        day: 'Sunday'
    },
    {
        day: 'Monday'
    },
    {
        day: 'Tuesday'
    },
    {
        day: 'Wednesday'
    },
    {
        day: 'Thursday'
    },
    {
        day: 'Friday'
    },
    {
        day: 'Saturday'
    },

]


export const getSlotArr = () => {

    let slotArr = [
        {
            day: "Sunday",
            slotsArr: [
                {
                    time: "7AM-8AM",
                    startTime: new Date(new Date().setHours(7, 0, 0)),
                    endTime: new Date(new Date().setHours(8, 0, 0)),
                    checked: false
                },
                {
                    time: "8AM-9AM",
                    startTime: new Date(new Date().setHours(8, 0, 0)),
                    endTime: new Date(new Date().setHours(9, 0, 0)),
                    checked: false
                },
                {
                    time: "9AM-10AM",
                    startTime: new Date(new Date().setHours(9, 0, 0)),
                    endTime: new Date(new Date().setHours(10, 0, 0)),
                    checked: false
                },
                {
                    time: "10AM-11AM",
                    startTime: new Date(new Date().setHours(10, 0, 0)),
                    endTime: new Date(new Date().setHours(11, 0, 0)),
                    checked: false
                },
                {
                    time: "11AM-12PM",
                    startTime: new Date(new Date().setHours(11, 0, 0)),
                    endTime: new Date(new Date().setHours(12, 0, 0)),
                    checked: false
                },
                {
                    time: "12PM-1PM",
                    startTime: new Date(new Date().setHours(12, 0, 0)),
                    endTime: new Date(new Date().setHours(13, 0, 0)),
                    checked: false
                },
                {
                    time: "1PM-2PM",
                    startTime: new Date(new Date().setHours(13, 0, 0)),
                    endTime: new Date(new Date().setHours(14, 0, 0)),
                    checked: false
                },
                {
                    time: "2PM-3PM",
                    startTime: new Date(new Date().setHours(14, 0, 0)),
                    endTime: new Date(new Date().setHours(15, 0, 0)),
                    checked: false
                },
                {
                    time: "3PM-4PM",
                    startTime: new Date(new Date().setHours(15, 0, 0)),
                    endTime: new Date(new Date().setHours(16, 0, 0)),
                    checked: false
                },
                {
                    time: "4PM-5PM",
                    startTime: new Date(new Date().setHours(16, 0, 0)),
                    endTime: new Date(new Date().setHours(17, 0, 0)),
                    checked: false
                },
                {
                    time: "5PM-6PM",
                    startTime: new Date(new Date().setHours(17, 0, 0)),
                    endTime: new Date(new Date().setHours(18, 0, 0)),
                    checked: false
                },
                {
                    time: "6PM-7PM",
                    startTime: new Date(new Date().setHours(18, 0, 0)),
                    endTime: new Date(new Date().setHours(19, 0, 0)),
                    checked: false
                },
                {
                    time: "7PM-8PM",
                    startTime: new Date(new Date().setHours(19, 0, 0)),
                    endTime: new Date(new Date().setHours(20, 0, 0)),
                    checked: false
                },
                {
                    time: "8PM-9PM",
                    startTime: new Date(new Date().setHours(20, 0, 0)),
                    endTime: new Date(new Date().setHours(21, 0, 0)),
                    checked: false
                },
                {
                    time: "9PM-10PM",
                    startTime: new Date(new Date().setHours(21, 0, 0)),
                    endTime: new Date(new Date().setHours(22, 0, 0)),
                    checked: false
                },
            ],
        },
        {
            day: "Monday",
            slotsArr: [
                {
                    time: "7AM-8AM",
                    startTime: new Date(new Date().setHours(7, 0, 0)),
                    endTime: new Date(new Date().setHours(8, 0, 0)),
                    checked: false
                },
                {
                    time: "8AM-9AM",
                    startTime: new Date(new Date().setHours(8, 0, 0)),
                    endTime: new Date(new Date().setHours(9, 0, 0)),
                    checked: false
                },
                {
                    time: "9AM-10AM",
                    startTime: new Date(new Date().setHours(9, 0, 0)),
                    endTime: new Date(new Date().setHours(10, 0, 0)),
                    checked: false
                },
                {
                    time: "10AM-11AM",
                    startTime: new Date(new Date().setHours(10, 0, 0)),
                    endTime: new Date(new Date().setHours(11, 0, 0)),
                    checked: false
                },
                {
                    time: "11AM-12PM",
                    startTime: new Date(new Date().setHours(11, 0, 0)),
                    endTime: new Date(new Date().setHours(12, 0, 0)),
                    checked: false
                },
                {
                    time: "12PM-1PM",
                    startTime: new Date(new Date().setHours(12, 0, 0)),
                    endTime: new Date(new Date().setHours(13, 0, 0)),
                    checked: false
                },
                {
                    time: "1PM-2PM",
                    startTime: new Date(new Date().setHours(13, 0, 0)),
                    endTime: new Date(new Date().setHours(14, 0, 0)),
                    checked: false
                },
                {
                    time: "2PM-3PM",
                    startTime: new Date(new Date().setHours(14, 0, 0)),
                    endTime: new Date(new Date().setHours(15, 0, 0)),
                    checked: false
                },
                {
                    time: "3PM-4PM",
                    startTime: new Date(new Date().setHours(15, 0, 0)),
                    endTime: new Date(new Date().setHours(16, 0, 0)),
                    checked: false
                },
                {
                    time: "4PM-5PM",
                    startTime: new Date(new Date().setHours(16, 0, 0)),
                    endTime: new Date(new Date().setHours(17, 0, 0)),
                    checked: false
                },
                {
                    time: "5PM-6PM",
                    startTime: new Date(new Date().setHours(17, 0, 0)),
                    endTime: new Date(new Date().setHours(18, 0, 0)),
                    checked: false
                },
                {
                    time: "6PM-7PM",
                    startTime: new Date(new Date().setHours(18, 0, 0)),
                    endTime: new Date(new Date().setHours(19, 0, 0)),
                    checked: false
                },
                {
                    time: "7PM-8PM",
                    startTime: new Date(new Date().setHours(19, 0, 0)),
                    endTime: new Date(new Date().setHours(20, 0, 0)),
                    checked: false
                },
                {
                    time: "8PM-9PM",
                    startTime: new Date(new Date().setHours(20, 0, 0)),
                    endTime: new Date(new Date().setHours(21, 0, 0)),
                    checked: false
                },
                {
                    time: "9PM-10PM",
                    startTime: new Date(new Date().setHours(21, 0, 0)),
                    endTime: new Date(new Date().setHours(22, 0, 0)),
                    checked: false
                },
            ],
        },
        {
            day: "Tuesday",
            slotsArr: [
                {
                    time: "7AM-8AM",
                    startTime: new Date(new Date().setHours(7, 0, 0)),
                    endTime: new Date(new Date().setHours(8, 0, 0)),
                    checked: false
                },
                {
                    time: "8AM-9AM",
                    startTime: new Date(new Date().setHours(8, 0, 0)),
                    endTime: new Date(new Date().setHours(9, 0, 0)),
                    checked: false
                },
                {
                    time: "9AM-10AM",
                    startTime: new Date(new Date().setHours(9, 0, 0)),
                    endTime: new Date(new Date().setHours(10, 0, 0)),
                    checked: false
                },
                {
                    time: "10AM-11AM",
                    startTime: new Date(new Date().setHours(10, 0, 0)),
                    endTime: new Date(new Date().setHours(11, 0, 0)),
                    checked: false
                },
                {
                    time: "11AM-12PM",
                    startTime: new Date(new Date().setHours(11, 0, 0)),
                    endTime: new Date(new Date().setHours(12, 0, 0)),
                    checked: false
                },
                {
                    time: "12PM-1PM",
                    startTime: new Date(new Date().setHours(12, 0, 0)),
                    endTime: new Date(new Date().setHours(13, 0, 0)),
                    checked: false
                },
                {
                    time: "1PM-2PM",
                    startTime: new Date(new Date().setHours(13, 0, 0)),
                    endTime: new Date(new Date().setHours(14, 0, 0)),
                    checked: false
                },
                {
                    time: "2PM-3PM",
                    startTime: new Date(new Date().setHours(14, 0, 0)),
                    endTime: new Date(new Date().setHours(15, 0, 0)),
                    checked: false
                },
                {
                    time: "3PM-4PM",
                    startTime: new Date(new Date().setHours(15, 0, 0)),
                    endTime: new Date(new Date().setHours(16, 0, 0)),
                    checked: false
                },
                {
                    time: "4PM-5PM",
                    startTime: new Date(new Date().setHours(16, 0, 0)),
                    endTime: new Date(new Date().setHours(17, 0, 0)),
                    checked: false
                },
                {
                    time: "5PM-6PM",
                    startTime: new Date(new Date().setHours(17, 0, 0)),
                    endTime: new Date(new Date().setHours(18, 0, 0)),
                    checked: false
                },
                {
                    time: "6PM-7PM",
                    startTime: new Date(new Date().setHours(18, 0, 0)),
                    endTime: new Date(new Date().setHours(19, 0, 0)),
                    checked: false
                },
                {
                    time: "7PM-8PM",
                    startTime: new Date(new Date().setHours(19, 0, 0)),
                    endTime: new Date(new Date().setHours(20, 0, 0)),
                    checked: false
                },
                {
                    time: "8PM-9PM",
                    startTime: new Date(new Date().setHours(20, 0, 0)),
                    endTime: new Date(new Date().setHours(21, 0, 0)),
                    checked: false
                },
                {
                    time: "9PM-10PM",
                    startTime: new Date(new Date().setHours(21, 0, 0)),
                    endTime: new Date(new Date().setHours(22, 0, 0)),
                    checked: false
                },
            ],
        },
        {
            day: "Wednesday",
            slotsArr: [
                {
                    time: "7AM-8AM",
                    startTime: new Date(new Date().setHours(7, 0, 0)),
                    endTime: new Date(new Date().setHours(8, 0, 0)),
                    checked: false
                },
                {
                    time: "8AM-9AM",
                    startTime: new Date(new Date().setHours(8, 0, 0)),
                    endTime: new Date(new Date().setHours(9, 0, 0)),
                    checked: false
                },
                {
                    time: "9AM-10AM",
                    startTime: new Date(new Date().setHours(9, 0, 0)),
                    endTime: new Date(new Date().setHours(10, 0, 0)),
                    checked: false
                },
                {
                    time: "10AM-11AM",
                    startTime: new Date(new Date().setHours(10, 0, 0)),
                    endTime: new Date(new Date().setHours(11, 0, 0)),
                    checked: false
                },
                {
                    time: "11AM-12PM",
                    startTime: new Date(new Date().setHours(11, 0, 0)),
                    endTime: new Date(new Date().setHours(12, 0, 0)),
                    checked: false
                },
                {
                    time: "12PM-1PM",
                    startTime: new Date(new Date().setHours(12, 0, 0)),
                    endTime: new Date(new Date().setHours(13, 0, 0)),
                    checked: false
                },
                {
                    time: "1PM-2PM",
                    startTime: new Date(new Date().setHours(13, 0, 0)),
                    endTime: new Date(new Date().setHours(14, 0, 0)),
                    checked: false
                },
                {
                    time: "2PM-3PM",
                    startTime: new Date(new Date().setHours(14, 0, 0)),
                    endTime: new Date(new Date().setHours(15, 0, 0)),
                    checked: false
                },
                {
                    time: "3PM-4PM",
                    startTime: new Date(new Date().setHours(15, 0, 0)),
                    endTime: new Date(new Date().setHours(16, 0, 0)),
                    checked: false
                },
                {
                    time: "4PM-5PM",
                    startTime: new Date(new Date().setHours(16, 0, 0)),
                    endTime: new Date(new Date().setHours(17, 0, 0)),
                    checked: false
                },
                {
                    time: "5PM-6PM",
                    startTime: new Date(new Date().setHours(17, 0, 0)),
                    endTime: new Date(new Date().setHours(18, 0, 0)),
                    checked: false
                },
                {
                    time: "6PM-7PM",
                    startTime: new Date(new Date().setHours(18, 0, 0)),
                    endTime: new Date(new Date().setHours(19, 0, 0)),
                    checked: false
                },
                {
                    time: "7PM-8PM",
                    startTime: new Date(new Date().setHours(19, 0, 0)),
                    endTime: new Date(new Date().setHours(20, 0, 0)),
                    checked: false
                },
                {
                    time: "8PM-9PM",
                    startTime: new Date(new Date().setHours(20, 0, 0)),
                    endTime: new Date(new Date().setHours(21, 0, 0)),
                    checked: false
                },
                {
                    time: "9PM-10PM",
                    startTime: new Date(new Date().setHours(21, 0, 0)),
                    endTime: new Date(new Date().setHours(22, 0, 0)),
                    checked: false
                },
            ],
        },
        {
            day: "Thursday",
            slotsArr: [
                {
                    time: "7AM-8AM",
                    startTime: new Date(new Date().setHours(7, 0, 0)),
                    endTime: new Date(new Date().setHours(8, 0, 0)),
                    checked: false
                },
                {
                    time: "8AM-9AM",
                    startTime: new Date(new Date().setHours(8, 0, 0)),
                    endTime: new Date(new Date().setHours(9, 0, 0)),
                    checked: false
                },
                {
                    time: "9AM-10AM",
                    startTime: new Date(new Date().setHours(9, 0, 0)),
                    endTime: new Date(new Date().setHours(10, 0, 0)),
                    checked: false
                },
                {
                    time: "10AM-11AM",
                    startTime: new Date(new Date().setHours(10, 0, 0)),
                    endTime: new Date(new Date().setHours(11, 0, 0)),
                    checked: false
                },
                {
                    time: "11AM-12PM",
                    startTime: new Date(new Date().setHours(11, 0, 0)),
                    endTime: new Date(new Date().setHours(12, 0, 0)),
                    checked: false
                },
                {
                    time: "12PM-1PM",
                    startTime: new Date(new Date().setHours(12, 0, 0)),
                    endTime: new Date(new Date().setHours(13, 0, 0)),
                    checked: false
                },
                {
                    time: "1PM-2PM",
                    startTime: new Date(new Date().setHours(13, 0, 0)),
                    endTime: new Date(new Date().setHours(14, 0, 0)),
                    checked: false
                },
                {
                    time: "2PM-3PM",
                    startTime: new Date(new Date().setHours(14, 0, 0)),
                    endTime: new Date(new Date().setHours(15, 0, 0)),
                    checked: false
                },
                {
                    time: "3PM-4PM",
                    startTime: new Date(new Date().setHours(15, 0, 0)),
                    endTime: new Date(new Date().setHours(16, 0, 0)),
                    checked: false
                },
                {
                    time: "4PM-5PM",
                    startTime: new Date(new Date().setHours(16, 0, 0)),
                    endTime: new Date(new Date().setHours(17, 0, 0)),
                    checked: false
                },
                {
                    time: "5PM-6PM",
                    startTime: new Date(new Date().setHours(17, 0, 0)),
                    endTime: new Date(new Date().setHours(18, 0, 0)),
                    checked: false
                },
                {
                    time: "6PM-7PM",
                    startTime: new Date(new Date().setHours(18, 0, 0)),
                    endTime: new Date(new Date().setHours(19, 0, 0)),
                    checked: false
                },
                {
                    time: "7PM-8PM",
                    startTime: new Date(new Date().setHours(19, 0, 0)),
                    endTime: new Date(new Date().setHours(20, 0, 0)),
                    checked: false
                },
                {
                    time: "8PM-9PM",
                    startTime: new Date(new Date().setHours(20, 0, 0)),
                    endTime: new Date(new Date().setHours(21, 0, 0)),
                    checked: false
                },
                {
                    time: "9PM-10PM",
                    startTime: new Date(new Date().setHours(21, 0, 0)),
                    endTime: new Date(new Date().setHours(22, 0, 0)),
                    checked: false
                },
            ],
        },
        {
            day: "Friday",
            slotsArr: [
                {
                    time: "7AM-8AM",
                    startTime: new Date(new Date().setHours(7, 0, 0)),
                    endTime: new Date(new Date().setHours(8, 0, 0)),
                    checked: false
                },
                {
                    time: "8AM-9AM",
                    startTime: new Date(new Date().setHours(8, 0, 0)),
                    endTime: new Date(new Date().setHours(9, 0, 0)),
                    checked: false
                },
                {
                    time: "9AM-10AM",
                    startTime: new Date(new Date().setHours(9, 0, 0)),
                    endTime: new Date(new Date().setHours(10, 0, 0)),
                    checked: false
                },
                {
                    time: "10AM-11AM",
                    startTime: new Date(new Date().setHours(10, 0, 0)),
                    endTime: new Date(new Date().setHours(11, 0, 0)),
                    checked: false
                },
                {
                    time: "11AM-12PM",
                    startTime: new Date(new Date().setHours(11, 0, 0)),
                    endTime: new Date(new Date().setHours(12, 0, 0)),
                    checked: false
                },
                {
                    time: "12PM-1PM",
                    startTime: new Date(new Date().setHours(12, 0, 0)),
                    endTime: new Date(new Date().setHours(13, 0, 0)),
                    checked: false
                },
                {
                    time: "1PM-2PM",
                    startTime: new Date(new Date().setHours(13, 0, 0)),
                    endTime: new Date(new Date().setHours(14, 0, 0)),
                    checked: false
                },
                {
                    time: "2PM-3PM",
                    startTime: new Date(new Date().setHours(14, 0, 0)),
                    endTime: new Date(new Date().setHours(15, 0, 0)),
                    checked: false
                },
                {
                    time: "3PM-4PM",
                    startTime: new Date(new Date().setHours(15, 0, 0)),
                    endTime: new Date(new Date().setHours(16, 0, 0)),
                    checked: false
                },
                {
                    time: "4PM-5PM",
                    startTime: new Date(new Date().setHours(16, 0, 0)),
                    endTime: new Date(new Date().setHours(17, 0, 0)),
                    checked: false
                },
                {
                    time: "5PM-6PM",
                    startTime: new Date(new Date().setHours(17, 0, 0)),
                    endTime: new Date(new Date().setHours(18, 0, 0)),
                    checked: false
                },
                {
                    time: "6PM-7PM",
                    startTime: new Date(new Date().setHours(18, 0, 0)),
                    endTime: new Date(new Date().setHours(19, 0, 0)),
                    checked: false
                },
                {
                    time: "7PM-8PM",
                    startTime: new Date(new Date().setHours(19, 0, 0)),
                    endTime: new Date(new Date().setHours(20, 0, 0)),
                    checked: false
                },
                {
                    time: "8PM-9PM",
                    startTime: new Date(new Date().setHours(20, 0, 0)),
                    endTime: new Date(new Date().setHours(21, 0, 0)),
                    checked: false
                },
                {
                    time: "9PM-10PM",
                    startTime: new Date(new Date().setHours(21, 0, 0)),
                    endTime: new Date(new Date().setHours(22, 0, 0)),
                    checked: false
                },
            ],
        },
        {
            day: "Saturday",
            slotsArr: [
                {
                    time: "7AM-8AM",
                    startTime: new Date(new Date().setHours(7, 0, 0)),
                    endTime: new Date(new Date().setHours(8, 0, 0)),
                    checked: false
                },
                {
                    time: "8AM-9AM",
                    startTime: new Date(new Date().setHours(8, 0, 0)),
                    endTime: new Date(new Date().setHours(9, 0, 0)),
                    checked: false
                },
                {
                    time: "9AM-10AM",
                    startTime: new Date(new Date().setHours(9, 0, 0)),
                    endTime: new Date(new Date().setHours(10, 0, 0)),
                    checked: false
                },
                {
                    time: "10AM-11AM",
                    startTime: new Date(new Date().setHours(10, 0, 0)),
                    endTime: new Date(new Date().setHours(11, 0, 0)),
                    checked: false
                },
                {
                    time: "11AM-12PM",
                    startTime: new Date(new Date().setHours(11, 0, 0)),
                    endTime: new Date(new Date().setHours(12, 0, 0)),
                    checked: false
                },
                {
                    time: "12PM-1PM",
                    startTime: new Date(new Date().setHours(12, 0, 0)),
                    endTime: new Date(new Date().setHours(13, 0, 0)),
                    checked: false
                },
                {
                    time: "1PM-2PM",
                    startTime: new Date(new Date().setHours(13, 0, 0)),
                    endTime: new Date(new Date().setHours(14, 0, 0)),
                    checked: false
                },
                {
                    time: "2PM-3PM",
                    startTime: new Date(new Date().setHours(14, 0, 0)),
                    endTime: new Date(new Date().setHours(15, 0, 0)),
                    checked: false
                },
                {
                    time: "3PM-4PM",
                    startTime: new Date(new Date().setHours(15, 0, 0)),
                    endTime: new Date(new Date().setHours(16, 0, 0)),
                    checked: false
                },
                {
                    time: "4PM-5PM",
                    startTime: new Date(new Date().setHours(16, 0, 0)),
                    endTime: new Date(new Date().setHours(17, 0, 0)),
                    checked: false
                },
                {
                    time: "5PM-6PM",
                    startTime: new Date(new Date().setHours(17, 0, 0)),
                    endTime: new Date(new Date().setHours(18, 0, 0)),
                    checked: false
                },
                {
                    time: "6PM-7PM",
                    startTime: new Date(new Date().setHours(18, 0, 0)),
                    endTime: new Date(new Date().setHours(19, 0, 0)),
                    checked: false
                },
                {
                    time: "7PM-8PM",
                    startTime: new Date(new Date().setHours(19, 0, 0)),
                    endTime: new Date(new Date().setHours(20, 0, 0)),
                    checked: false
                },
                {
                    time: "8PM-9PM",
                    startTime: new Date(new Date().setHours(20, 0, 0)),
                    endTime: new Date(new Date().setHours(21, 0, 0)),
                    checked: false
                },
                {
                    time: "9PM-10PM",
                    startTime: new Date(new Date().setHours(21, 0, 0)),
                    endTime: new Date(new Date().setHours(22, 0, 0)),
                    checked: false
                },
            ],
        }
        
    ]


    return slotArr
}
