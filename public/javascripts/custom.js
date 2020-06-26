currentHeight = $("#today-data").outerHeight();
container_height = $("#second_row").outerHeight();
var set_todo_height = container_height - currentHeight;
$("#todo_container").css({ height: set_todo_height + "px" });
function tmpmobile(value) {
  $("#mobileList").append("<option value=" + value + ">");
}
$(".ui.dropdown").dropdown();
$(".circular.right.floated.basic.button").popup();
$(".popup").popup();
$("#dashboard-preloader").fadeOut(400);
$(".sidebar-menu-toggler").click(function () {
  $(".ui.sidebar")
    .sidebar("setting", "transition", "overlay")
    .sidebar("toggle");
});
$(".ui.checkbox").checkbox();
$(".ui.radio.checkbox").checkbox();
$('.top.menu .item').tab();
 
$('.ui.rating').rating('setting', 'onRate', function(value) {
   $("#starRating").val(value);
});

 

$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;
 
$('.ui.accordion')
  .accordion()
;




// //////////////////////////////////////////////////////////////// Ajax
function deletefaculty(id) { 
  event.preventDefault();
  const name = $(this).attr('data-name');
  $.ajax({
    type: "GET",
    url: "/admin/deleteFaculty/"+id,
    data:  {id : id},
    dataType: "text",
    success: function (response) {
       if(response == "success"){
        $("#card_"+id).fadeOut(300)
       }
    }
  }) ;
}


function submitRadio(question, value, role) {
  const name = document.getElementById('studentName').value;
  const phone = document.getElementById('studentPhone').value;
  const email = document.getElementById('studentEmail').value;
  const fID = document.getElementById('fID').value;

  if( role == "admin"){
    formData = {fID : fID , name : name , phone : phone, email : email, question : question, value :  value}
    $.ajax({
      type: "POST",
      url: "/submitAdminFeedbackQuestion",
      data: formData,
      dataType: "text",
      success: function (response) {
        alert(response);
        
      }
    });
  }
  else if(role == "faculty"){
    formData = {fID : fID , name : name , phone : phone, email : email, question : question, value :  value}
    $.ajax({
      type: "POST",
      url: "/submitFacultyFeedbackQuestion",
      data: formData,
      dataType: "text",
      success: function (response) {
        alert(response);
        
      }
    });
  }
}
function submitComment(question, value, role) {
  const name = document.getElementById('studentName').value;
  const phone = document.getElementById('studentPhone').value;
  const email = document.getElementById('studentEmail').value;
  const fID = document.getElementById('fID').value;
  if (role == 'faculty') {
    formData = {fID : fID , name : name , phone : phone, email : email, question : question, value :  value}
    $.ajax({
      type: "POST",
      url: "/submitFacultyFeedbackQuestion",
      data: formData,
      dataType: "text",
      success: function (response) {
        alert(response);
        
      }
    });
  }
  else if (role == 'admin') {
    formData = {fID : fID , name : name , phone : phone, email : email, question : question, value :  value}
    $.ajax({
      type: "POST",
      url: "/submitAdminFeedbackQuestion",
      data: formData,
      dataType: "text",
      success: function (response) {
        alert(response);
        
      }
    });
  }
}
 
 
$('.facultyStarRating').rating('setting', 'onRate', function(value) {
  var question =  $(this).data('id');
  submitStarRating(question, value);
});

function submitStarRating(question, value) {
  const name = document.getElementById('studentName').value;
  const phone = document.getElementById('studentPhone').value;
  const email = document.getElementById('studentEmail').value;
  const fID = document.getElementById('fID').value;
  
  formData = {fID : fID , name : name , phone : phone, email : email, question : question, value :  value}
  $.ajax({  
    type: "POST",
    url: "/submitFacultyFeedbackQuestion",
    data: formData,
    dataType: "text",
    success: function (response) {
      alert(response);
      
    }
  });
}

 




