const mongoose = require('mongoose')
const crypto = require('crypto')

const pharmaSchema = new mongoose.Schema({
    regId: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    pharmaName: {
        type: String,
        trim: true,
        required: true,
        max: 100
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    hashed_password:{
        type: String,
        required: true, 
    },
    salt:{
        type: String
    },
    
    role:{
        type: String,
        default: 'pharma'
    },
    resetPasswordLink:{
        data: String,
        // default: ''
    },
    cart:{
        type: Array
    }
}, {timestamps: true})

pharmaSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

pharmaSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password){
        if(!password) return ''
        try{
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        }
        catch(err){
            return ''
        }
    },

    makeSalt: function(){
        return Math.round(new Date().valueOf() * Math.round()) + ''
    }
}

module.exports = mongoose.model('Pharmacy', pharmaSchema)