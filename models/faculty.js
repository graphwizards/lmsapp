const mongoose = require('mongoose');


// user schema
const facultySchema = mongoose.Schema({
    employeeId : Number,
    employeeCode : String,
    fullName : String,
    firstName : String,
    lastName : String,
    phone : String,
    email : String,
    program : {
        type : String,
        default : "MBA",
    },
    designation : String,
    joiningDate : String,
    subjects : String,
    password : String,
    active : {
        type : Boolean,
        default : true,
    } ,
    role: {
        type : String,
        default : "faculty",
    },
    createDate : {
        type : Date,
        default : Date.now(),
    },
});


// user model 
mongoose.model('faculty', facultySchema);

// exports
module.exports = mongoose.model('faculty');