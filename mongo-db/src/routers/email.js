const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY = "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"

sgMail.setApiKey(SENDGRID_API_KEY)

const msg  = {
    to: 'maaznadeem246@gmail.com',
    from: 'maaznadeem246@gmail.com',
    subject:'First test email ',
    text: 'sending email using sgMail in Nodejs',
    // html: '<strong>sgMail also can send HTML Formated email </strong>'
}

sgMail.send(msg).then((sent)=>{
    console.log(sent[0])
}).catch((e)=>{
    console.log(e)
})