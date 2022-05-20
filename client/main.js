// document.getElementById('options').onchange = function() {

//     var i = 1;
//     var myDiv = document.getElementById(i);
//     console.log(myDiv);
//     while(myDiv) {
//         myDiv.style.display = 'none';
//         myDiv = document.getElementById(++i);
//     }
//     document.getElementById(this.value).style.display = 'block';
// };

$("#options").change(function () {
  var category = $("select[name=options]").val();
  console.log(category);
  if (category == "certificatetype1") {
    console.log("certificatetype1 is selected");
    $("#content").load("completion.html");
  } else if (category == "completion1") {
    console.log("category completion1 is selected");
    $("#content").load("completion1.html");
  } else if (category == "completion2") {
    console.log("category completion2 is selected");
    $("#content").load("completion2.html");
  }
  //   else if (category == 'completion3')
  // {
  //      console.log('completion3 is selected');
  //      $('#content').load('completion3.html');
  // }
});

function certificateload() {
  var category = $("select[name=options]").val();
  if (category == "certificatetype1") {
    console.log("certificatetype1 is selected");
    $("#content").load("completion.html");
  } else if (category == "completion1") {
    console.log("category completion1 is selected");
    $("#content").load("completion1.html");
  } else if (category == "completion2") {
    console.log("category completion2 is selected");
    $("#content").load("completion2.html");
  }
}
certificateload();
async function pay50() {
  var data = {
    item1: "50 Certificate Downloads",
    item1qty: "1",
    item1price: 50 * 100,
  };

  console.log("50 clocked");
  const res = await fetch(
    "/server/gen_certificate_function/create-checkout-session",
    {
      method: "POST",
      body: JSON.stringify({ data: data }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const body = await res.json();
  console.log(body);
  window.location.href = body.url;
}

async function pay100() {
  var data = {
    item1: "150 Certificate Downloads",
    item1qty: "1",
    item1price: 100 * 100,
  };

  console.log("100 clocked");
  const res = await fetch(
    "/server/gen_certificate_function/create-checkout-session",
    {
      method: "POST",
      body: JSON.stringify({ data: data }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const body = await res.json();
  console.log(body);
  window.location.href = body.url;
}

async function allowDownload() {
  console.log("allowDownload invoked on load ...........");
  const res = await fetch(
    "/server/gen_certificate_function/incrementDownloadCounter",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();
  console.log(data);
  $("#dCount").text(data.message);
  if (data.message === "Plan Exhausted. Please buy a Plan") {
    console.log("1");
    return false;
  } else {
    console.log("2");
    return true;
  }
}

async function getDownloadCount() {
  console.log("getDownload invoked on load ...........");
  const res = await fetch("/server/gen_certificate_function/getDownloadCount", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  console.log(data);
  $("#dCount").text(data.message);
  if (data.message === "Plan Exhausted. Please buy a Plan") {
    console.log("1");
    return false;
  } else {
    console.log("2");
    return true;
  }
}
