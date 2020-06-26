var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const programs = require('../models/programs');
const students = require('./../models/students');
const subjects = require('./../models/subjects');
const faculty = require('./../models/faculty');
var generatePassword = require('password-generator');
const adminFeedback = require('./../models/adminFeedback');
const bcrypt = require('bcrypt');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));



// /////////////////////////////////////////////////////////////////////////////// Admin

router.get('/', (req, res) => {
  programs.find((err, programsRows)=>{
    // if(err)throw err;
    res.render('admin/index', {title : "Administrator | Dashboard", layout : 'layouts/admin', programs : programsRows});
  });

 
});

// ///////////////////////////////////////////////////////////////////////////////  Faculty

router.get('/faculty', (req, res) => {
  faculty.find((err, facultydata)=>{
    var message = req.dataProcessed;
    res.render('admin/faculty', {title : "Administrator | Faculty", facultydata:facultydata, layout : 'layouts/admin'});
     
  });
});

// ///////////////////////////////////////////////////////////////////////////////add Faculty

router.get('/addFaculty', (req, res, next) => {
subjects.find((err, subjectsData)=>{    
  res.render('admin/addFaculty', {title : "Administrator | Add Faculty",subjectsData : subjectsData, layout : 'layouts/admin'});

})
});

// ///////////////////////////////////////////////////////////////////////////////create Faculty

router.post('/createFaculty', (req, res) => {
  var newPassword = generatePassword(6, false);
  var hashPassword = bcrypt.hashSync(newPassword, 10);
 console.log(newPassword);
  var createFaculty = new faculty({
    employeeId : req.body.employeeId,
    employeeCode : req.body.employeeCode,
    fullName : req.body.fullName,
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    phone : req.body.phone,
    email : req.body.email,
    program :  req.body.program,
    designation : req.body.designation,
    joiningDate : req.body.joiningDate,
    subjects : req.body.subjects,
    password : hashPassword,
   });
  
   createFaculty.save((err, result)=>{
     if(err) throw err;
     console.log(req.body.password);
      res.redirect('/admin/faculty');
   })
});

// /////////////////////////////////////////////////////////////////////////////// Delete Faculty
router.get('/deleteFaculty/:facultyID', (req, res) => {
  faculty.findByIdAndRemove(req.params.facultyID, (err, result)=>{
    if(err) throw err;
     res.send('success');
  })

});



// ///////////////////////////////////////////////////////////////////////////////  Students

router.get('/students', (req, res) => {
  programs.find((err, programsRows)=>{
    if(err)throw err;
    students.find((err, studentsData)=>{
      if(err) throw err;
      res.render('admin/students', {title : "Administrator | Students", layout : 'layouts/admin', programs : programsRows, studentsData : studentsData});

    })
  });
});


// ///////////////////////////////////////////////////////////////////////////////add student

router.get('/addStudent', (req, res) => {
  programs.find((err, programsRows)=>{
    if(err)throw err;
    res.render('admin/addStudent', {title : "Administrator | Students", layout : 'layouts/admin', programs : programsRows});
  });
});



// ///////////////////////////////////////////////////////////////////////////////create Program

router.post('/createProgram', (req, res) => {
  var programsData = new programs({
    name : req.body.name
  });
  programsData.save(function (err, result) {
    if (err) {
      return res.json({
        status: false,
        message: "DB Insert failed..",
        error: err
      });
    }
    console.log(result)
    res.send(result);
  });
});


// ///////////////////////////////////////////////////////////////////////////////create Subject
router.post('/createSubject', (req, res) => {
  var createSubjects = new subjects({
    name : req.body.name
  });
  createSubjects.save(function (err, result) {
    if (err) {
      return res.json({
        status: false,
        message: "DB Insert failed..",
        error: err
      });
    }
    console.log(result)
    res.send(result);
  })
});


 
// ///////////////////////////////////////////////////////////////////////////////create Student

router.post('/createStudent', (req, res) => {
 var createStudent = new students({
  section : req.body.section,
  program : req.body.program,
  roll_no : req.body.roll_no,
  reg_no : req.body.reg_no,
  fullName : req.body.fullName,
  lastName : req.body.lastName,
  firstName : req.body.firstName,
  gender : req.body.gender,
  email : req.body.email,
  contact : req.body.contact,
  eContact : req.body.eContact,
  dob : req.body.dob,
  address : req.body.address,
  state : req.body.state,
  fatherName : req.body.fatherName,
  fatherEmail : req.body.fatherEmail,
  fatherPhone : req.body.fatherPhone,
  motherName : req.body.motherName,
  motherEmail : req.body.motherEmail,
  motherPhone : req.body.motherPhone,
  graduation : req.body.graduation,
  fIncome : req.body.fIncome,
 });

 createStudent.save((err, result)=>{
   if(err) throw err;
    res.redirect('/admin/students');
 })
});

// /////////////////////////////////////////////////////////////////////////////// Feedback


router.get('/feedback', (req, res) => {
  adminFeedback.find({"status" : true},(err, activequestions)=>{
    adminFeedback.find({"status" : false}, (err, deactiveQuestions)=>{
      res.render('admin/feedback', {title : "Feedbacks | Faculty LM Thapar School of Management", layout : 'layouts/admin', questions : activequestions, deactiveQuestions : deactiveQuestions});
    });
    

  })
 

});


// /////////////////////////////////////////////////////////////////////////////// Delete feedback Question

router.get('/deleteFeedbackQuestion/:id', (req, res) => {
  adminFeedback.findByIdAndRemove(req.params.id, (err, result)=>{
    if(err) throw err;
     res.redirect('/admin/feedback');
  })

});

// /////////////////////////////////////////////////////////////////////////////// Add Feedback Question

router.get('/addfeedback', (req, res) => {
programs.find((err, programsData)=>{
  res.render('admin/addFeedback', {title : "Create Feedback Form | Faculty LM Thapar School of Management", layout : 'layouts/admin', programsData : programsData});

})
});

// /////////////////////////////////////////////////////////////////////////////// Deactivate Feedback Questions

router.get('/deactivateFeedbackQuestion/:id', (req, res) => {
  var questionID =  req.params.id;
  adminFeedback.findByIdAndUpdate( questionID, {"status" : false}, (err, result)=>{
    if(err) throw err;
    res.redirect('/admin/feedback');
  })
  });
  
  
  // /////////////////////////////////////////////////////////////////////////////// Activate Feedback Questions

  router.get('/activateFeedbackQuestion/:id', (req, res) => {
    var questionID =  req.params.id;
    adminFeedback.findByIdAndUpdate( questionID, {"status" : true}, (err, result)=>{
      if(err) throw err;
      res.redirect('/admin/feedback');
    })
    });
  

// /////////////////////////////////////////////////////////////////////////////// Create  Feedback Question

router.post('/feedback', (req, res) => {
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
  
  var createQuestion = new adminFeedback({
    questionType : questionType,
    question : req.body.question,
    rating : rating,
    star : star,
    smiley : smiley,
    yes : yes,
    like : like,
    comment : comment,
  });
  createQuestion.save((err, result)=>{
    if(err) throw err;
    adminFeedback.find({"status" : true},(err, activequestions)=>{
      adminFeedback.find({"status" : false}, (err, deactiveQuestions)=>{
        var successMessage  = req.body.question;
        res.render('admin/feedback', {title : "Feedbacks | Faculty LM Thapar School of Management", layout : 'layouts/admin', questions : activequestions, deactiveQuestions : deactiveQuestions, successMessage : successMessage});
      });
      
  
    })
   
  })

});
 
module.exports = router;
