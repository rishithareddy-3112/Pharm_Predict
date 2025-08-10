const express = require('express')

const router = express.Router()

const { addMedicine, displayMedicine, searchMedicine, predictClass, viewAnalytics, viewOrders } = require('../controllers/medicine')

router.post('/admin/add-medicine', addMedicine)
router.get('/display-medicine', displayMedicine)
router.get('/search-medicine', searchMedicine)
router.post('/predict-class', predictClass)
// router.get('/analytics', viewAnalytics)
// router.get('/orders', viewOrders)
module.exports = router // {}