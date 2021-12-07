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

export const sortByText={
    popularity:"Popularity",
    priceLowToHigh:"price low to high",
    priceHighToLow:"price high to low",
    customerRating:"Customer Rating"
}
