var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
var urlencoded = require('urlencode');
const facultyFeedback = require('./../models/facultyFeedback');
const adminFeedback = require('./../models/adminFeedback');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const programs = require('../models/programs');
const students = require('./../models/students');
const subjects = require('./../models/subjects');
const faculty = require('./../models/faculty');

 
router.use(flash());
 
// //////////////////////////////////////////////////////////////////////////////////////////////// Session
router.use(cookieParser('secret'));

router.use(session({
  secret :'secret',
  maxAge  : new Date(Date.now() + 3600000), //1 Hour
  expires : new Date(Date.now() + 3600000),
  resave : true,
  saveUninitialized : true,
  cookie:{
    maxAge: 100000000000000
}
}));

 router.use(bodyParser.json());
 router.use(bodyParser.urlencoded({extended: true}));
const layout = "layouts/faculty";
const QRCode = require('qrcode')
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

router.use(function(req, res, next){
  res.locals.susess_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message')
  res.locals.error = req.flash('error');
  next();
});


// /////////////////////////////////////////////////////////////////////////////////////////////////// Check Authentication
// check authentication

const checkAuthenticated = function(req, res, next){
  if (req.isAuthenticated()) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    return next();
} else {
    res.redirect('/faculty');
}
}


const checkAuthenticatedLogin = function(req, res, next){
  if (req.isAuthenticated()) {
    res.redirect('/faculty/feedback');
    
  }
  return next();
}


// /////////////////////////////////////////////////////////////////////////////////////////////// Authintation Stratigy
var localStrategy  = require('passport-local').Strategy;
passport.use('faculty',new localStrategy({ usernameField : 'employeeid' },(employeeid, password, done)=>{
  faculty.findOne({ employeeId : employeeid}, (err, data)=>{
    if(err) throw err;
    if(!data){
      return done(null, false, {message : "Employee ID Dosen't Exists..."});
    }
    bcrypt.compare(password, data.password, (err, match)=>{
      if(err){
        return done(null, false);
      }
      if(!match){
        return done(null, false, {message : "Password Dosen't Match..."});
      }
      if(match){
        return done(null, data);
      }
    })
  })
}))






// ////////////////////////////////////////////////////////////////////////////////////////////////// Login Page
router.get('/', checkAuthenticatedLogin,  function(req, res, next) {
   res.render('faculty/index' , {title : "Dashboard | Faculty LM Thapar School of Management", });
});

router.get('/takeAttandance',  (req, res) => {
  students.find((err, studentsData)=>{
    res.render('faculty/takeAttandance', {title : "Take Attandance | Faculty LM Thapar School of Management", layout : layout, studentsData : studentsData});

  })
});
// ////////////////////////////////////////////////////////////////////////////////////////////////// Login POST
router.post('/login',checkAuthenticatedLogin, (req, res, next) => {
  passport.authenticate('faculty', {
    failureRedirect : '/faculty',
    successRedirect : '/faculty/feedback',
    failureFlash : true,
  })(req, res, next)
 
});

// ////////////////////////////////////////////////////////////////////////////////////////////////// Feedback
router.get('/feedback',checkAuthenticated, (req, res) => {
  facultyFeedback.find({"status" : true, "facultyID" : req.user.id},(err, activequestions)=>{
    facultyFeedback.find({"status" : false, "facultyID" : req.user.id}, (err, deactiveQuestions)=>{
      adminFeedback.find({"status" : true}, (err, adminQuestions)=>{
        QRCode.toDataURL('http://localhost:5000/sendfeedback/'+req.user.id, function (err, qrcode) {
          res.render('faculty/feedback', {title : "Feedbacks | Faculty LM Thapar School of Management", layout : layout, questions : activequestions, deactiveQuestions : deactiveQuestions, fromAdminQuestions : adminQuestions, qrcode : qrcode, user : req.user});
        })
        console.log(req.user)
      })
    
    });
    

  })
});

  router.get('/myFeedback',checkAuthenticated, (req, res) => {
    facultyFeedback.find({"status" : true , "facultyID" : req.user.id},(err, activequestions)=>{
        adminFeedback.find({"status" : true}, (err, adminQuestions)=>{
          QRCode.toDataURL('http://localhost:5000/sendfeedback', function (err, qrcode) {
            res.render('faculty/myFeedback', {title : "Feedbacks | Faculty LM Thapar School of Management", layout : layout, questions : activequestions,   fromAdminQuestions : adminQuestions, qrcode : qrcode});
          })
          
        })
      
    
      
  
    })

  });
 

router.get('/deleteFeedbackQuestion/:id',checkAuthenticated, (req, res) => {
  facultyFeedback.findByIdAndRemove(req.params.id, (err, result)=>{
    if(err) throw err;
     res.redirect('/faculty/feedback');
  })

});
router.get('/addfeedback',checkAuthenticated, (req, res) => {
programs.find((err, programsData)=>{
  res.render('faculty/addFeedback', {title : "Create Feedback Form | Faculty LM Thapar School of Management", layout : layout, programsData : programsData});

})
});

router.post('/createFeedbackQuestion',checkAuthenticated, (req, res) => {
  var questionType = req.body.questionType;
  var star = false;
  var rating = false;
  var smiley = false;
  var yes = false;
  var like = false;
  var comment = false;


  if (questionType == "rating") {
    var rating = true;

  }
  else if (questionType == "starRating") {
    var star = true;
  }
  else if (questionType == "smiley") {
    var smiley = true;
  }
  else if (questionType == "yes") {
    var yes = true;
  }
  else if (questionType == "like") {
    var like = true;

  }
  else if (questionType == "comment") {
    var comment = true;
  }
  
  var createQuestion = new facultyFeedback({
    questionType : questionType,
    question : req.body.question,
    facultyID :  req.user.id,
    rating : rating,
    star : star,
    smiley : smiley,
    yes : yes,
    like : like,
    comment : comment,
  });
  createQuestion.save((err, result)=>{
    if(err) throw err;
     res.redirect('/faculty/feedback');
  })

});

// deactivate feedback question
router.get('/deactivateFeedbackQuestion/:id',checkAuthenticated, (req, res) => {
var questionID =  req.params.id;
facultyFeedback.findByIdAndUpdate( questionID, {"status" : false}, (err, result)=>{
  if(err) throw err;
  res.redirect('/faculty/feedback');
})
});


// activate feedback question
router.get('/activateFeedbackQuestion/:id', (req, res) => {
  var questionID =  req.params.id;
  facultyFeedback.findByIdAndUpdate( questionID, {"status" : true}, (err, result)=>{
    if(err) throw err;
    res.redirect('/faculty/feedback');
  })
  });


module.exports = router;


