import { v4 as uuidv4 } from "uuid";

export const getCheckoutId = () => {

    let checkoutId = localStorage.getItem('mc-checkoutId')
    if(!checkoutId){
        checkoutId = uuidv4()
        localStorage.setItem('mc-checkoutId',checkoutId)
    }
    return checkoutId
}