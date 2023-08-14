const nodemailer=require("nodemailer")
const pug=require("pug")  
const htmlToText=require("html-to-text")      
module.exports=class Email{
    constructor(user,url){
        this.to=user.email
        this.firstName=user.name.split(" ")[0]
        this.url=url
        this.from=`Tomislav Krtalic <${process.env.EMAIL_FROM}>`
    }
    newTransporter(){
        if(process.env.NODE_ENV==="production"){
            
            return 1
        }
        return nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            auth:{
                user:process.env.EMAIL,
                pass:process.env.EMAIL_PASSWORD
            }
        })
    }
    async send(template,subject){
         // render html 
         const html=pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
            firstName:this.firstName,
            url:this.url,
            subject
         })
         // email options
         const emailOptions={
            from:this.from,
            to:this.to,
            subject,
            html,
            text:htmlToText.fromString(html)
        }
        // create transport and send email
       
        await this.newTransporter().sendMail(emailOptions)
    }
    async sendWelcome(){
        await this.send("welcome","Welcome to the Natours Family !")
    }
    async sendPasswordRreset(){
        await this.send(
            "passwordReset",
            "Your password reset token (valid only for 10 minutes)"
        )
    }
}
const sendEmail=async options=>{
    // create transporter
    const transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    // define email options
    const emailOptions={
        from:"Tomislav Krtalic <tomo1235@hello.com>",
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    // send email with nodemailre
    try{
       await transporter.sendMail(emailOptions) 
    }
    catch (err){
        console.log(err)
        return
    }
    
}
