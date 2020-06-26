const mongoose = require('mongoose');


// user schema
const studentSchema = mongoose.Schema({
    section : String,
    program : String,
    roll_no : Number,
    reg_no : String,
    fullName : String,
    lastName : String,
    firstName : String,
    gender : String,
    email : String,
    contact : Number,
    eContact : Number,
    dob : String,
    address : String,
    state : String,
    fatherName : String,
    fatherEmail : String,
    fatherPhone : String,
    motherName : String,
    motherEmail : String,
    motherPhone : String,
    graduation : String,
    fIncome : String,
    createDate: {
        type: Date,
        default: Date.now(),
    }
});


// user model 
mongoose.model('students', studentSchema);

// exports
module.exports = mongoose.model('students');