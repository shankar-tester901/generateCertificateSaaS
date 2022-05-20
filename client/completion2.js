$('#certify_line_certificateOfCompletion').on('input', certify_line_certificateOfCompletion).trigger('input');
$('#person_name_certificateOfCompletion').on('input', person_name_certificateOfCompletion).trigger('input');
$('#program_name_certificateOfCompletion').on('input', program_name_certificateOfCompletion).trigger('input');
$('#program_name_certificateDetails').on('input', program_name_certificateDetails).trigger('input');
$('#awarded_on_certificateOfCompletion').on('input', awarded_on_certificateOfCompletion).trigger('input');



$("#certify_line_certificateNameOfInstitute")
  .on("input", certificateNameOfInstitute)
  .trigger("input");



$('#awarded_on_certificateOfCompletionPrincipal').on('input',awarded_on_certificateOfCompletionPrincipal).trigger('input');



function certify_line_certificateOfCompletion() {
    var canvas = document.getElementById('cEditorHeading_certificateOfCompletion');
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.font = '16pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText(this.value, 0, 0);
}


function program_name_certificateDetails() {
    var canvas = document.getElementById('cEditorHeading_program_name_certificateDetails');
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.font = '12pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText(this.value, 0, 0);
}


function person_name_certificateOfCompletion() {
    var canvas = document.getElementById('cEditorNameOfPerson_certificateOfCompletion');
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.font = '12pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText(this.value, 0, 0);
}


function program_name_certificateOfCompletion() {
    var canvas = document.getElementById('cEditorCertName_certificateOfCompletion');
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;
    context.translate(canvas.width/2, canvas.height/2);
    context.font = '24pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText(this.value, 0, 0);
}


function awarded_on_certificateOfCompletion() {
    var canvas = document.getElementById('cEditorCertDate_certificateOfCompletion');
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;
    context.translate(canvas.width/2, canvas.height/2);
    context.font = '20pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText(this.value, 0, 0);
}

function awarded_on_certificateOfCompletionPrincipal() {
    var canvas = document.getElementById('cEditorCertDate_certificateOfPrincipal');
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;
    context.translate(canvas.width/2, canvas.height/2);
    context.font = '15pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText(this.value, 0, 0);
}


function certificateNameOfInstitute() {
  var canvas = document.getElementById(
    "cEditorHeading_certificateInstitutionName"
  );
  var context = canvas.getContext("2d");
  canvas.width = canvas.width;
  context.translate(canvas.width / 2, canvas.height / 2);
  context.font = "15pt Calibri";
  context.textAlign = "center";
  context.fillStyle = "#000";
  context.fillText(this.value, 0, 0);
}

//Create PDf from HTML...
async function Create_certificateOfCompletionPDF() {
    
    //make a server side call to increase the count 
    let allowDownload_or_not = await allowDownload();
       // console.log('allowDownload_or_not  here now ........... ' + allowDownload_or_not);

    if (allowDownload_or_not)
    {
        var HTML_Width = $(".certificateOfCompletion").width();
        var HTML_Height = $(".certificateOfCompletion").height();
        var top_left_margin = 15;
        var PDF_Width = HTML_Width + (top_left_margin * 2);
        var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
        var canvas_image_width = HTML_Width;
        var canvas_image_height = HTML_Height;
        
        var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
        
        html2canvas($(".certificateOfCompletion")[0]).then(function (canvas) {
            var imgData = canvas.toDataURL("image/jpeg", 1.0);
            var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
            for (var i = 1; i <= totalPDFPages; i++) { 
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
            }
            pdf.save("certificateOfCompletion.pdf");
          //  $(".certificateOfCompletion").hide();
        });
        
    }
    
}
var imageLoader_Here = document.getElementById('imageLoader_here');
imageLoader_Here.addEventListener('change', imageCanvas22, false);
var canvas2 = document.getElementById('imageCanvas_image');
var ctx2 = canvas2.getContext('2d');
ctx2.font = "30px Arial";
ctx2.fillText("Header Image", 10, 50);




function imageCanvas22(e) {
    console.log('handleImage_certificateOfCompletion ...');
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas2.width = img.width;
            canvas2.height = img.height;
            ctx2.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}


document.getElementById("getval").addEventListener("change", readURL, true);
function readURL() {
  console.log("readURL invoked");
  var file = document.getElementById("getval").files[0];
  console.log(file);
  var reader = new FileReader();
  reader.onloadend = function () {
    document.getElementById("cert").style.backgroundImage =
      "url(" + reader.result + ")";
  };
  if (file) {
    reader.readAsDataURL(file);
  } else {
  }
}
