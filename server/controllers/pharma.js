const Pharmacy = require('../models/pharmacy')

exports.read = (req, res) => {
    const pharmaId = req.params.id;
    Pharmacy.findById(pharmaId).exec()
    .then((pharma)=>{
        if (!pharma) {
            return res.status(400).json({
                error: 'Pharmacy not found'
            })
        }
        pharma.hashed_password = undefined
        pharma.salt = undefined
        res.json(pharma)
    })
    .catch((err)=>{
        return res.status(400).json({
            error: 'Pharmacy not found'
        })
    })
}

exports.update = (req, res) => {
    const { pharmaName, password } = req.body;
    Pharmacy.findOne({ _id: req.auth._id })
    .then((pharma)=>{
        if (!pharma) {
            return res.status(400).json({
                error: 'Pharmacy not found'
            })
        }
        if (!pharmaName) {
            return res.status(400).json({
                error: 'Name is required'
            })
        } else {
            pharma.pharmaName = pharmaName
        }
        // console.log(password.length)
        if(password.length < 6 && password.length > 0){
            return res.status(400).json({
                error: 'Password should be minimum 6 characters long'
            })
        }
        else if(password.length!=0){
            pharma.password = password
        }
        pharma.save()
        .then((updatedPharma)=>{
            updatedPharma.hashed_password = undefined
            updatedPharma.salt = undefined
            res.json(updatedPharma)
        })
        .catch((err)=>{
            return res.status(400).json({
                error: 'Pharma update failed'
            })
        })
    })
    .catch((err)=>{
        return res.status(400).json({
            error: 'Pharmacy not found'
        })
    })
}

