const mongoose = require('mongoose');


// user schema
const programSchema = mongoose.Schema({
   
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
mongoose.model('programs', programSchema);

// exports
module.exports = mongoose.model('programs');