"use strict"
import {login,logOut} from "./login"
import { updateAccount } from "./updateSettings"
import { bookTour } from "./stripe"
const form=document.querySelector(".form--login")
const logOutBtn=document.querySelector(".nav__el--logout")
const  userDataForm=document.querySelector(".form-user-data")
const newPasswordData=document.querySelector(".form-user-password")
const bookBtn=document.getElementById("book-tour")
if(form) {
form.addEventListener("submit",function(e){
    e.preventDefault();
    const email=document.getElementById("email")?.value
    const password=document.getElementById("password")?.value
    console.log("try to login")
    login(email,password)
})
}
if(logOutBtn){
    logOutBtn.addEventListener("click",logOut)
}
if(userDataForm){
    userDataForm.addEventListener("submit",(e)=>{
        e.preventDefault()
        const form=new FormData()
        form.append("name",document.getElementById("name").value)
        form.append("email",document.getElementById("email").value)
        form.append("photo",document.getElementById("photo").files[0])
        // const email=document.getElementById("email").value
        // const name=document.getElementById("name").value
        updateAccount(form,"email")
    })
}
if(newPasswordData){
    newPasswordData.addEventListener("submit",async(e)=>{
        e.preventDefault()
        document.querySelector(".btn--save-password").textContent="updating"
        const password=document.getElementById("password").value
        const passwordCurrent=document.getElementById("password-current").value
        const passwordConfirm=document.getElementById("password-confirm").value
        await updateAccount({password,passwordCurrent,passwordConfirm},"password")
    })
    document.getElementById("password-current").value="";
    document.getElementById("password-confirm").value="";
    document.getElementById("password").value="";
}
if(bookBtn)
 bookBtn.addEventListener("click",async(e)=>{
    e.target.textContent="Processing..."
    const {tourId}=e.target.dataset
    bookTour(tourId)
 })

