import axios from "axios";
import { showAlert } from "./alert";

export const updateAccount=async(data,type)=>{
    try{
        const resp=await axios({
            method:"PATCH",
            url:type==="email"?"/api/v1/users/updateMe":"/api/v1/users/updatePassword",
            data
        })
        if(resp.data.status==="success"){
           showAlert("success",`you are succesfuly updated ${type==="email"?"email and name":"password"}.`)
        }
    }
    catch(error){
        showAlert("error",error.message);
    }
}