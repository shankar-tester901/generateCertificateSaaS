
$('#line1').on('input', createTxt).trigger('input');
$('#line2').on('input', createTxt2).trigger('input');
$('#line3').on('input', createTxt3).trigger('input');
$("#certificateName").on("input", certificateName).trigger("input");



function createTxt() {
    var canvas = document.getElementById('cEditor');
    var context = canvas.getContext('2d');
    
    canvas.width = canvas.width;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.font = '16pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText(this.value, 0, 0);
}


function createTxt2() {
    var canvas = document.getElementById('cEditor2');
    var context = canvas.getContext('2d');
    
    canvas.width = canvas.width;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.font = '12pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText(this.value, 0, 0);
}


function createTxt3() {
    var canvas = document.getElementById('cEditor3');
    var context = canvas.getContext('2d');
    
    canvas.width = canvas.width;
    context.translate(canvas.width/2, canvas.height/2);
    context.font = '11pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText(this.value, 0, 0);
}


function certificateName() {
  var canvas = document.getElementById("certificateHeading");
  var context = canvas.getContext("2d");

  canvas.width = canvas.width;
  context.translate(canvas.width / 2, canvas.height / 2);
  context.font = "11pt Calibri";
  context.textAlign = "center";
  context.fillStyle = "#000";
  context.fillText(this.value, 0, 0);
}



//Create PDf from HTML...
async function CreatePDFfromHTML() {
    
    //make a server side call to increase the count 
    let allowDownload_or_not = await allowDownload();
 //   console.log('allowDownload_or_not  ' + allowDownload_or_not);
    if (allowDownload_or_not) {
        var HTML_Width = $(".html-content").width();
        var HTML_Height = $(".html-content").height();
        var top_left_margin = 15;
        var PDF_Width = HTML_Width + (top_left_margin * 2);
        var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
        var canvas_image_width = HTML_Width;
        var canvas_image_height = HTML_Height;
    
        var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
    
        html2canvas($(".html-content")[0]).then(function (canvas) {
            var imgData = canvas.toDataURL("image/jpeg", 1.0);
            var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
            for (var i = 1; i <= totalPDFPages; i++) {
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
            }
            pdf.save("Pollution-Certificate.pdf");
         //   $(".html-content").hide();
        });
    }
}
