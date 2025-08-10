const {check} = require('express-validator')

exports.userSignupvalidator = [
    check('regId')
    .not()
    .isEmpty()
    .withMessage('Registration ID is required'),

    check('pharmaName')
    .not()
    .isEmpty()
    .withMessage('Pahrmacy name is required'),

    check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),

    check('password')
    .isLength({min: 6})
    .withMessage('Password must be atleast 6 characters long')
];

exports.userSigninValidator = [
    check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),

    check('password')
    .isLength({min: 6})
    .withMessage('Password must be atleast 6 characters long')
];

exports.forgotPasswordValidator = [
    check('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Must be a valid email address'),
];

exports.resetPasswordValidator = [
    check('newPassword')
    .not()
    .isEmpty()
    .isLength({min: 6})
    .withMessage('Password must be atleast 6 characters long')
];