const express = require('express')
const {signup, accountActivation, signin, forgotPassword, resetPassword, addToCart, getCart, removeFromCart, getOrders} = require('../controllers/auth')
const { userSignupvalidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/auth')
const { runValidation } = require('../validators')

const router = express.Router()

router.post('/signup',userSignupvalidator, runValidation, signup)
router.post('/account-activation', accountActivation)
router.post('/signin',userSigninValidator, runValidation, signin)
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword)
router.put('/reset-password',resetPasswordValidator, runValidation, resetPassword)
router.post('/add-to-cart', addToCart)
router.get('/user-cart/:id', getCart)
router.get('/orders', getOrders)
router.delete('/remove-from-cart/:userId/:drugId', removeFromCart)
module.exports = router