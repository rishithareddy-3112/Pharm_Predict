const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    substitute0: {
        type: String,
        trim: true,
        // required: true,
    },
    substitute1: {
        type: String,
        trim: true,
        // required: true,
    },
    substitute2: {
        type: String,
        trim: true,
        // required: true,
    },
    substitute3: {
        type: String,
        trim: true,
        // required: true,
    },
    substitute4: {
        type: String,
        trim: true,
        // required: true,
    },
    sideEffect0:{
        type: String,
        trim: true,
        max: 100
    },
    sideEffect1:{
        type: String,
        trim: true,
        max: 100
    },
    sideEffect2:{
        type: String,
        trim: true,
        max: 100
    },
    sideEffect3:{
        type: String,
        trim: true,
        max: 100
    },
    sideEffect4:{
        type: String,
        trim: true,
        max: 100
    },
    use0:{
        type: String,
        trim: true,
        max: 100
    },
    use1:{
        type: String,
        trim: true,
        max: 100
    },
    use2:{
        type: String,
        trim: true,
        max: 100
    },
    use3:{
        type: String,
        trim: true,
        max: 100
    },
    use4:{
        type: String,
        trim: true,
        max: 100
    },
    ChemicalClass:{
        type: String,
        trim: true,
        max: 100
    },
    ActionClass:{
        type: String,
        trim: true,
        max: 100
    },
    price:{
        type: Number,
    }
}, {timestamps: true})

module.exports = mongoose.model('drug', medicineSchema)