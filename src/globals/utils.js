export const checkValidPhone = (phone) => {
    let tempPhone = parseInt(phone);
    let regex = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
    console.log(regex.test(phone))
    return regex.test(tempPhone)
}