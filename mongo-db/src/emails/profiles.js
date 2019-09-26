const sgGrid = require('@sendgrid/mail')

const sgGrid_API = process.env.SENDGRID_API_KEY
sgGrid.setApiKey(sgGrid_API)


const sendWelcomeEmail = (name, email) => {
    
    const mailContent = {
        from: "maaznadeem246@gmail.com",
        to: email,
        subject: "Welcome to Profile-Wishlist application",
        text: ` Hello ${name} This is weclome email at the time of profile creation`
    }
    sgGrid.send(mailContent)
}

const sendGoodByEmail = (name, email) => {
    const mailContent = {
        from: "maaznadeem246@gmail.com",
        to: email,
        subject: "Welcome to Profile-Wishlist application",
        text: ` Hello ${name} ,
            Hope to see you soon`
    }
    sgGrid.send(mailContent)
}

module.exports = {sendWelcomeEmail, sendGoodByEmail}