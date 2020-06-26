const mongoose = require('mongoose');


// user schema
const subjectsSchema = mongoose.Schema({
   
    name: {
        type : String,
        require : true,
    },    
    createDate: {
        type: Date,
        default: Date.now(),
    }
});


// user model 
mongoose.model('subject', subjectsSchema);

// exports
module.exports = mongoose.model('subject');