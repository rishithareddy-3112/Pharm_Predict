const Pharmacy = require('../models/pharmacy')
const Drug = require('../models/medicine')
const elasticEmail = require('@elasticemail/elasticemail-client');
const { expressjwt } = require("express-jwt");
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const mongoose = require('mongoose');

exports.signup = (req, res) => {
    //console.log(req.body)
    const { regId, pharmaName, email, password } = req.body
    Pharmacy.findOne({ email }).exec()
        .then((pharma) => {
            if (pharma) {
                return res.status(400).json({
                    error: 'Email is taken'
                })
            }
            const token = jwt.sign({ regId, pharmaName, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' })

            const client = elasticEmail.ApiClient.instance;
            const apikey = client.authentications['apikey'];
            apikey.apiKey = process.env.ELASTICMAIL_API_KEY;

            let api = new elasticEmail.EmailsApi()

            const emailData = {
                Recipients: {
                    To: [email]
                },
                Content: {
                    Body: [
                        {
                            ContentType: "HTML",
                            Charset: "utf-8",
                            Content: `
                        <h1>Please use the following link to activate your account</h1>
                        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    `
                        },
                        {
                            ContentType: "plainText",
                            Charset: "utf-8",
                            Content: "Activate your Account"
                        }
                    ],
                    From: process.env.EMAIL_FROM,
                    subject: "Account Activation Link",
                },
            }
            const callback = (err, data, response) => {
                if (err) {
                    console.error(err)
                    res.status(200).json({ success: err })
                }
                else {
                    console.log('API called successfully')
                    console.log('Email sent')
                    console.log(req.body)
                    res.status(200).json({
                        success: "done",
                        message: `Email is successfully sent to ${email}`
                    })
                }
            }
            api.emailsTransactionalPost(emailData, callback)
        })
}

exports.accountActivation = (req, res) => {
    const { token } = req.body;

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: 'Expired link! SignUp again'
                })
            }
            const { regId, pharmaName, email, password } = jwt.decode(token)
            const newPharma = new Pharmacy({ regId, pharmaName, email, password })
            newPharma.save()
                .then(() => {
                    return res.json({
                        message: 'SignUp success, please signin'
                    })
                })
                .catch((err) => {
                    return res.status(400).json({
                        error: 'Error saving user in database, Try signup again'
                    })
                })
        })
    }
    else {
        return res.json({
            message: 'Something went wrong! Try again'
        })
    }
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    Pharmacy.findOne({ email }).exec()
        .then((pharma) => {
            if (!pharma) {
                return res.status(400).json({
                    error: "User with that email doesn't exist, please SignUp!"
                })
            }

            if (!pharma.authenticate(password)) {
                return res.status(400).json({
                    error: "Incorrect password"
                })
            }
            const token = jwt.sign({ _id: pharma._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
            const { _id, regId, pharmaName, email, role } = pharma

            return res.json({
                token: token,
                user: { _id, regId, pharmaName, email, role }
            })
        })
        .catch((err) => {
            return res.status(400).json({
                error: "SignUp failed"
            })
        })
}

exports.requireSignin = expressjwt({ //Middleware -  so that only authorized/logged in user can see the profile
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], //makes data available in req.user
})

exports.adminMiddleware = (req, res, next) => {
    // console.log(req.auth)
    Pharmacy.findById({ _id: req.auth._id }).exec()
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    error: "Pharma not found"
                })
            }
            if (user.role !== "admin") {
                return res.status(400).json({
                    error: "Admin resource access denied"
                })
            }
            req.profile = user
            next()
        })
        .catch((err) => {
            return res.status(400).json({
                error: "Pharma not found"
            })
        })
}

exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    Pharmacy.findOne({ email }).exec()
        .then((pharma) => {
            if (!pharma) {
                return res.status(400).json({
                    error: "Email doesn't exist"
                })
            }
            const token = jwt.sign({ _id: pharma._id, pharmaName: pharma.pharmaName }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' })

            const client = elasticEmail.ApiClient.instance;
            const apikey = client.authentications['apikey'];
            apikey.apiKey = process.env.ELASTICMAIL_API_KEY;

            let api = new elasticEmail.EmailsApi()

            const emailData = {
                Recipients: {
                    To: [email]
                },
                Content: {
                    Body: [
                        {
                            ContentType: "HTML",
                            Charset: "utf-8",
                            Content: `
                        <h1>Please use the following link to reset your password</h1>
                        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                    `
                        },
                        {
                            ContentType: "plainText",
                            Charset: "utf-8",
                            Content: "Reset your password"
                        }
                    ],
                    From: process.env.EMAIL_FROM,
                    subject: "Password Reset Link",
                },
            }
            return pharma.updateOne({ resetPasswordLink: token }).exec()
                .then((pharma) => {
                    const callback = (err, data, response) => {
                        if (err) {
                            console.error(err)
                            res.status(200).json({ success: err })
                        }
                        else {
                            console.log('API called successfully')
                            console.log('Email sent')
                            console.log(req.body)
                            res.status(200).json({
                                success: "done",
                                message: `Reset password link is successfully sent to ${email}`
                            })
                        }
                    }
                    api.emailsTransactionalPost(emailData, callback)
                })
                .catch((err) => {
                    return res.status(400).json({
                        "error": "Error sending reset password link!"
                    })
                })
        })
        .catch((err) => {
            return res.status(400).json({
                error: "Email doesn't exist"
            })
        })

}

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
            if (err) {
                return res.status(400).json({
                    err: 'Expired link, try again!'
                })
            }
            Pharmacy.findOne({ resetPasswordLink })
                .then((pharma) => {
                    if (!pharma) {
                        return res.status(400).json({
                            err: 'Something went wrong, try later!'
                        })
                    }
                    const updatedFields = {
                        password: newPassword,
                        resetPasswordLink: ''
                    }
                    pharma = _.extend(pharma, updatedFields)
                    pharma.save()
                        .then(() => {
                            res.json({
                                message: `Great! Now, you can signin with your new password`
                            })
                        })
                        .catch((err) => {
                            return res.status(400).json({
                                err: 'Error resetting user password'
                            })
                        })

                })
                .catch((err) => {
                    return res.status(400).json({
                        "error": "Error resetting password"
                    })
                })
        })
    }
    else {
        return res.status(400).json({
            "error": "Error resetting password"
        })
    }
}

exports.addToCart = (req, res) => {
    const medicine = req.body.medicine
    const id = req.body.id;
    Pharmacy.findById(id).exec()
        .then((pharma) => {
            // console.log(pharma)
            if (!pharma.cart) {
                console.log("No cart");
                pharma.cart = []
            }
            // console.log(pharma)
            pharma.cart.push({
                name: medicine.name,
                price: medicine.price,
                substitute0: medicine.substitute0,
                substitute1: medicine.substitute1,
                substitute2: medicine.substitute2,
                substitute3: medicine.substitute3,
                substitute4: medicine.substitute4,
                sideEffect0: medicine.sideEffect0,
                sideEffect1: medicine.sideEffect1,
                sideEffect2: medicine.sideEffect2,
                sideEffect3: medicine.sideEffect3,
                sideEffect4: medicine.sideEffect4,
                use0: medicine.use0,
                use1: medicine.use1,
                use2: medicine.use2,
                use3: medicine.use3,
                use4: medicine.use4,
                id: medicine._id,
                class: medicine['Therapeutic Class']
            })
            pharma.save()
                .then(() => {
                    console.log("Saved")
                })
                .catch((err) => {
                    console.log("Error saving")
                })
        })
        .catch((err) => {
            console.log(err)
        })
    res.status(200).json({ message: "Product added to cart successfully" })
}
exports.getCart = (req, res) => {
    const id = req.params.id;
    Pharmacy.findById(id).exec()
        .then((pharma) => {

            res.status(200).json({
                "cart": pharma.cart
            })
        })
        .catch((err) => {
            res.status(400).json({
                "error": "No such pharmacy found!"
            })
        })
}
exports.removeFromCart = (req, res) => {
    const userId = req.params.userId
    const drugId = req.params.drugId
    Pharmacy.findOneAndUpdate({ _id: userId }, { $pull: { cart: { id: drugId } } },
        { new: true }).exec()
        .then((pharma) => {
            if (!pharma) {
                return res.status(404).json({ error: 'Pharmacy not found' });
            }

            return res.status(200).json({ message: 'Drug removed successfully', pharmacy: pharma });
        })
}
exports.getOrders = (req, res) => {
    Pharmacy.find({}).exec()
    .then((pharmacies)=>{
        const orders = {}
        pharmacies.forEach((pharma)=>{
            const cart = pharma.cart
            orders[pharma.pharmaName] = [];
            cart.forEach((drug)=>{
                orders[pharma.pharmaName].push(drug)
            })
        })
        res.status(200).json({
            "orders" : orders
        })
    })
    .catch((err)=>{
        console.log(err)
    })
}
