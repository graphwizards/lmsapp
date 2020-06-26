const mongoose = require('mongoose');


// user schema
const adminFeedbackSchema = mongoose.Schema({
     
    createDate : {
        type : Date,
        default : Date.now(),
    },
    questionType : {
        type : String,
        require : true,
    },
    rating : Boolean,
    star : Boolean,
    smiley : Boolean,
    yes : Boolean,
    like : Boolean,
    comment : Boolean,
    question : {
        type : String,
         require : true,
    },
    status : {
        type : String,
         default : true,
    },
    answers : [{
        date : {
            type : Date,
            default :  Date.now("dd/mm/YYYY"),
        },
        time :{
            type : Date,
           default: Date.now("HH:MM:ss"),
        } ,
        facultyID : String,
        studentName : String,
        phone : String,
        email : String,
        value : String,
    }]

});


// user model 
mongoose.model('adminFeedback', adminFeedbackSchema);

// exports
module.exports = mongoose.model('adminFeedback');