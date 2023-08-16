import axios from "axios"
import Stripe from "stripe"
import { showAlert } from "./alert"
const stripe= Stripe("pk_test_51Lien1KB5WheeZRmhicbupZ0PrOgX5uzwVeTCwITOoGeLz9GJXpiQrCc5PJrciHK1jGzXXfeQJitcIMnz4nvTQKM00nnCoBTHG")
export const bookTour=async tourID=>{
    try{
        const session=await axios({
          url:"/api/v1/bookings/checkout-session"+"/"+tourID
       })
       window.location.replace(session.data.session.url)
    }catch(err){
        console.log(err)
        showAlert("error",err)
    }

}