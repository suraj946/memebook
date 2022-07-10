const nodeMailer = require('nodemailer');
const sgMail = require("@sendgrid/mail");

exports.sendEmail = async(options)=>{
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const message = {
        to:options.email,
        from:process.env.SENDGRID_SENDER_MAIL,
        subject:options.subject,
        text:options.message,
        html:`<h2>${options.message}</h2>`
    };

    await sgMail.send(message);
}