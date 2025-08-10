const express = require('express')

const router = express.Router()

const {requireSignin, adminMiddleware} = require('../controllers/auth')
const {read, update} = require('../controllers/pharma')

router.get('/pharma/:id', requireSignin, read)
router.put('/pharma/update', requireSignin, update)
router.put('/admin/update', requireSignin, adminMiddleware, update)
module.exports = router // {}