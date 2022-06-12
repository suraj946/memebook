const nodeMailer = require('nodemailer');

exports.sendEmail = async(options)=>{
    const transporter = nodeMailer.createTransport({
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        }
    });

    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailOptions);
}

// exports.sendEmail = async(options)=>{
//     const transporter = nodeMailer.createTransport({
//         host: "smtp.mailtrap.io",
//         port: 465,
//         auth: {
//           user: "b3bd798d293f50",
//           pass: "fda391153333ad"
//         }
//       });

//     const mailOptions = {
//         from:"b3bd798d293f50",
//         to:options.email,
//         subject:options.subject,
//         text:options.message
//     }

//     await transporter.sendMail(mailOptions);
// }