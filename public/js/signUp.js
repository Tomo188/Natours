import axios from "axios";
import { showAlert } from "./alert";
import { login } from "./login";

export const signUp=async function(name,email,password){
   try{
    const resp=await axios(
     {   method: 'post',
        url: '/api/v1/users/signup',
        data: { email, password,confirmPassword:password,name },}
    )
    if(resp.data.status==="success")
    {
        showAlert('success', 'you loged in successfully');
        
    window.setTimeout(() => {
      location.assign('/login');
    }, 1500);
}
   }
   catch(err){
    console.log(err)
    showAlert('error', err.response.data.message);
   }
}