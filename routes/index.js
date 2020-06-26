var express = require('express');
var router = express.Router();
const facultyFeedback = require('./../models/facultyFeedback');
const adminFeedback = require('./../models/adminFeedback');
const faculty = require('./../models/faculty');
var lodash = require('lodash');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sendFeedback/:facultyID', (req, res) => {
  facultyFeedback.find({"status" : true, "facultyID" : req.params.facultyID},(err, activequestions)=>{
    adminFeedback.find({"status" : true}, (err, adminQuestions)=>{
      faculty.findById(req.params.facultyID, (err, facultyData)=>{
        if(err) throw err;
        res.render('feedback', {title : "Feedbacks |   LM Thapar School of Management",   questions : activequestions, fromAdminQuestions : adminQuestions, facultyData  :  facultyData});
      })
      
    });
  });
});
 
router.post('/submitAdminFeedbackQuestion', (req, res) => {
  const fID  = req.body.fID;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const question = req.body.question;
  const value = req.body.value;
  adminFeedback.findById(question, (err, data)=>{
    if(err){
      console.log(err);
    }
    else{
      adminFeedback.findByIdAndUpdate(question,{ $push : {"answers" : { "facultyID" : fID,  "studentName" : name, "phone" : phone , "email" : email, "value" : value } }}, (err, inserted)=>{
        if(err) throw err;
        console.log("data Inserted");
      })
      // const answers = data.answers;
      // const results = lodash.filter(answers, { 'email': email , "facultyID" : fID} );
      
      // console.log(results);
      // var answerIDArray = lodash.map(results, 'id');
      // const translated = lodash.map(answerIDArray).join(', ');
      //  const answerId = `${translated}`;
      //  console.log(answerId);
      //  adminFeedback.findOneAndUpdate({"answers._id" : answerId},{ $set:  { 'answers.$.value': value }}, (err, done)=>{
      //    if(err) throw err;
      //    console.log("data Updated");
      //    console.log(done);
      //  })

      // if(results == ""){
      //   adminFeedback.findByIdAndUpdate(question,{ $push : {"answers" : { "facultyID" : fID,  "studentName" : name, "phone" : phone , "email" : email, "value" : value } }}, (err, inserted)=>{
      //         if(err) throw err;
      //         console.log("data Inserted");
      //       })
      // }
      
 
    }

  });

});

router.post('/submitFacultyFeedbackQuestion', (req, res) => {
  const fID  = req.body.fID;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const question = req.body.question;
  const value = req.body.value;
  facultyFeedback.findById(question, (err, data)=>{
    if(err){
      console.log(err);
    }
    else{
      facultyFeedback.findByIdAndUpdate(question,{ $push : {"answers" : {  "studentName" : name, "phone" : phone , "email" : email, "value" : value } }}, (err, inserted)=>{
        if(err) throw err;
        console.log("data Inserted");
      })
      // const answers = data.answers;
      // const results = lodash.filter(answers, { 'email': email , "facultyID" : fID} );
      
      // console.log(results);
      // var answerIDArray = lodash.map(results, 'id');
      // const translated = lodash.map(answerIDArray).join(', ');
      //  const answerId = `${translated}`;
      //  console.log(answerId);
      //  facultyFeedback.findOneAndUpdate({"answers._id" : answerId},{ $set:  { 'answers.$.value': value }}, (err, done)=>{
      //    if(err) throw err;
      //    console.log("data Updated");
      //    console.log(done);
      //  })

      // if(results == ""){
      //   facultyFeedback.findByIdAndUpdate(question,{ $push : {"answers" : {  "studentName" : name, "phone" : phone , "email" : email, "value" : value } }}, (err, inserted)=>{
      //         if(err) throw err;
      //         console.log("data Inserted");
      //       })
      // }
      
 
    }

  });

});

router.get('/submitFeedback', (req, res) => {
  res.render('index', { title: 'Form Submited Successfully' });

});

module.exports = router;

