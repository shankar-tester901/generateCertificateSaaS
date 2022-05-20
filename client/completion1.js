$("#certify_line").on("input", certifyLine).trigger("input");
$("#person_name").on("input", personName).trigger("input");
$("#program_name").on("input", programName).trigger("input");
$("#awarded_on").on("input", awardedOn).trigger("input");
$("#department_hod").on("input", deptHOD).trigger("input");
$("#department_name").on("input", deptName).trigger("input");
$("#institution_name").on("input", institutionName).trigger("input");

function certifyLine() {
  var canvas = document.getElementById("cEditorHeading");
  var context = canvas.getContext("2d");

  canvas.width = canvas.width;
  context.translate(canvas.width / 2, canvas.height / 2);
  context.font = "16pt Calibri";
  context.textAlign = "center";
  context.fillStyle = "#000";
  context.fillText(this.value, 0, 0);
}

function personName() {
  var canvas = document.getElementById("cEditorNameOfPerson");
  var context = canvas.getContext("2d");

  canvas.width = canvas.width;
  context.translate(canvas.width / 2, canvas.height / 2);
  context.font = "12pt Calibri";
  context.textAlign = "center";
  context.fillStyle = "#000";
  context.fillText(this.value, 0, 0);
}

function programName() {
  var canvas = document.getElementById("cEditorCertName");
  var context = canvas.getContext("2d");

  canvas.width = canvas.width;
  context.translate(canvas.width / 2, canvas.height / 2);
  context.font = "24pt Calibri";
  context.textAlign = "center";
  context.fillStyle = "#000";
  context.fillText(this.value, 0, 0);
}

function awardedOn() {
  var canvas = document.getElementById("cEditorCertDate");
  var context = canvas.getContext("2d");

  canvas.width = canvas.width;
  context.translate(canvas.width / 2, canvas.height / 2);
  context.font = "20pt Calibri";
  context.textAlign = "center";
  context.fillStyle = "#000";
  context.fillText(this.value, 0, 0);
}

function deptHOD() {
  var canvas = document.getElementById("cEditorHeadingHOD");
  var context = canvas.getContext("2d");

  canvas.width = canvas.width;
  context.translate(canvas.width / 2, canvas.height / 2);
  context.font = "20pt Calibri";
  context.textAlign = "center";
  context.fillStyle = "#000";
  context.fillText(this.value, 0, 0);
}

function deptName() {
  var canvas = document.getElementById("cEditorDepartmentName");
  var context = canvas.getContext("2d");

  canvas.width = canvas.width;
  context.translate(canvas.width / 2, canvas.height / 2);
  context.font = "20pt Calibri";
  context.textAlign = "center";
  context.fillStyle = "#000";
  context.fillText(this.value, 0, 0);
}

function institutionName() {
  var canvas = document.getElementById("cEditorInstitutionName");
  var context = canvas.getContext("2d");

  canvas.width = canvas.width;
  context.translate(canvas.width / 2, canvas.height / 2);
  context.font = "20pt Calibri";
  context.textAlign = "center";
  context.fillStyle = "#000";
  context.fillText(this.value, 0, 0);
}

//Create PDf from HTML...
async function CreatePDFfromHTMLNext() {
  //make a server side call to increase the count
  let allowDownload_or_not = await allowDownload();
  console.log('createpdffromhtmlnext .... allowDownload_or_not here  ' + allowDownload_or_not);

  if (allowDownload_or_not) {
    var HTML_Width = $(".html-content-1").width();
    var HTML_Height = $(".html-content-1").height();

    var top_left_margin = 15;
    var PDF_Width = HTML_Width + top_left_margin * 2;
    var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($(".html-content-1")[0]).then(function (canvas) {
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
      pdf.addImage(
        imgData,
        "JPG",
        top_left_margin,
        top_left_margin,
        canvas_image_width,
        canvas_image_height
      );
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(
          imgData,
          "JPG",
          top_left_margin,
          -(PDF_Height * i) + top_left_margin * 4,
          canvas_image_width,
          canvas_image_height
        );
      }
      pdf.save("Completion-Certificate.pdf");
   //   $(".html-content-1").hide();
    });
  }
}

var imageLoader = document.getElementById("imageLoader");
imageLoader.addEventListener("change", handleImage, false);
var canvas = document.getElementById("imageCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
ctx.fillText("Header Image", 10, 50);

function handleImage(e) {
  console.log("handleImage ...");
  var reader = new FileReader();
  reader.onload = function (event) {
    var img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
}

document.getElementById("getval-cert").addEventListener("change", readURLCert, true);

function readURLCert() {
    console.log('readURLcert invoked');
    var file = document.getElementById("getval-cert").files[0];
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
