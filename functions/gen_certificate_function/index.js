const express = require("express");
const app = express();
const { resolve } = require("path");
const bodyParser = require("body-parser");

require("dotenv").config({ path: "./.env" });
const catalyst = require("zcatalyst-sdk-node");
app.use(express.json());

checkEnv();

const stripe = require("stripe")(
  "sk_test_51JklnfSChu38Ip39iBWjKJftCFiyTdRjJdZS5U8YbLx84cZCUZekZ100riYWq166"
);
// Use body-parser to retrieve the raw body as a buffer

function checkEnv() {
  const price = process.env.PRICE;
  console.log("Price is " + price);
  if (price === "price_12345" || !price) {
    console.log(
      "You must set a Price ID in the environment variables. Please see the README."
    );
  }
}

app.post("/create-checkout-session", async (req, res) => {
  console.log("in create checkout session ");
  //  console.log(req.body);
  const domainURL =
    "https://gencertificate-696722811.development.catalystserverless.com/app";

  var quantity = req.body.data;
  console.log(JSON.stringify(quantity));
  const catalystApp = catalyst.initialize(req);

  const pmTypes = "card".split(",").map((m) => m.trim());

  const session = await stripe.checkout.sessions.create({
    payment_method_types: pmTypes,
    mode: "payment",
    line_items: [
      {
        name: req.body.data.item1,
        amount: req.body.data.item1price,
        currency: "inr",
        quantity: req.body.data.item1qty,
      },
    ],
    success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/canceled.html`,
  });

    console.log(session);
     storePlanInfoToDB(catalystApp, req.body.data.item1);
  return res.json({ url: session.url });
});

app.post("/getAllTransactions", async (req, res) => {
  const events = await stripe.events.list({
    limit: 10,
  });
  console.log(events.data);
  return res.send(events.data);
});

app.post("/getAllInvoices", async (req, res) => {
  const invoices = await stripe.invoices.list({
    limit: 10,
  });
  console.log(invoices.data);
  return res.send(invoices.data);
});

app.get("/testing", (req, res) => {
  res.send("testing get");
});

app.post(
  "/webhook",
  express.json({ type: "application/json" }),
  (request, response) => {
    console.log("in webhook ");
    const event = request.body;
    console.log(event);
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(paymentIntent);
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        console.log(paymentMethod);

        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;

      case "charge.succeeded":
        // const paymentMethod = event.data.object;
        console.log("charge succeeded");
        console.log(event.data.object);

        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;

      case "charge.failed":
        // const paymentMethod = event.data.object;
        console.log("charge failed");
        console.log(event.data.object);

        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

app.post("/incrementDownloadCounter", async (req, res) => {
  console.log("incrementDownloadCounter called ");
  const catalystApp = catalyst.initialize(req);

  let zcql = catalystApp.zcql();
  var queryHere = "select downloadct from  DownloadCount";
  console.log("queryHere is  " + queryHere);
  let queryResult = await zcql.executeZCQLQuery(queryHere);
  console.log(queryResult);
  let val = JSON.parse(queryResult[0].DownloadCount.downloadct);
  val = val + 1;
  console.log("value is " + val);
  let planStatus = await checkIfPlanExhausted(catalystApp, val);
  // console.log('planStatus  +++++++   ' + planStatus);
  if (planStatus) {
    queryHere = "UPDATE DownloadCount SET downloadct = " + val;
    let queryResult2 = await zcql.executeZCQLQuery(queryHere);
    console.log(queryResult2);
    const responseData = {
      message: queryResult2[0].DownloadCount.downloadct,
    };
    const jsonContent = JSON.stringify(responseData);
    res.send(jsonContent);
  } else {
    console.log("planStatus is false ");
    const responseData = {
      message: "Plan Exhausted. Please buy a Plan",
    };
    const jsonContent = JSON.stringify(responseData);
    res.send(jsonContent);
  }
});

app.get("/getDownloadCount", async (req, res) => {
  console.log("incrementDownloadCounter called ");
  const catalystApp = catalyst.initialize(req);

  let zcql = catalystApp.zcql();
  var queryHere = "select downloadct from  DownloadCount";
  console.log("queryHere is  " + queryHere);
  let queryResult = await zcql.executeZCQLQuery(queryHere);
  console.log(queryResult);
  console.log("length is +++     " + queryResult.length);
  if (queryResult.length == 0) {
    await addDummyRow(zcql);
    const responseData = {
      message: 0,
    };
    const jsonContent = JSON.stringify(responseData);
    res.send(jsonContent);
  } else {
  }

  let val = JSON.parse(queryResult[0].DownloadCount.downloadct);
  const responseData = {
    message: val,
  };
  const jsonContent = JSON.stringify(responseData);
  res.send(jsonContent);
});

async function checkIfPlanExhausted(catalystApp, val) {
  let statusFlag = false;
  //compare with plan name
  let zcql = catalystApp.zcql();
  var queryHere = "select name from  PlanInfo";
  console.log("queryHere is  " + queryHere);
  let queryResult = await zcql.executeZCQLQuery(queryHere);
  let plan_name = queryResult[0].PlanInfo.name;
  // 50 Certificate Downloads or 150 Certificate Downloads
  console.log("plan name is " + plan_name + "  val is  " + val);
  if (plan_name === "50 Certificate Downloads") {
    let planCount = 50;
    if (val >= planCount) {
      statusFlag = false;
    } else {
      statusFlag = true;
    }
  } else if (plan_name === "150 Certificate Downloads") {
    let planCount = 150;
    if (val >= planCount) {
      console.log("returning false ========== ");
      statusFlag = false;
    } else {
      console.log("returning true ========== ");
      statusFlag = true;
    }
  }
  return statusFlag;
}

async function storePlanInfoToDB(catalystApp, name) {
  console.log("in store Plan Info ");
  let zcql = catalystApp.zcql();
  var queryHere = "select * from  PlanInfo";
  console.log("queryHere is  " + queryHere);
  let queryResult = await zcql.executeZCQLQuery(queryHere);
  let count = queryResult.length;
  console.log("count is     " + count);
  if (count == 0) {
    var queryHere = "insert into PlanInfo(name) values ('" + name + "')";
    console.log("store plan info details query  " + queryHere);
    let zcqlPromise = zcql.executeZCQLQuery(queryHere);
    zcqlPromise.then((queryResult) => {
      console.log(queryResult);
    });
  } else {
    let rowid = queryResult[0].PlanInfo.ROWID;
    console.log("row already present with rowid -        " + rowid);
    let datastore = catalystApp.datastore();
    let table = datastore.table("PlanInfo");
    let rowPromise = table.deleteRow(rowid);
    rowPromise.then((row) => {
      console.log(row);
    });

    var insertQ = "insert into PlanInfo(name) values ('" + name + "')";
    console.log("store plan info details query  " + insertQ);
    let zcqlPromiseQ = zcql.executeZCQLQuery(insertQ);
    zcqlPromiseQ.then(async (queryResult) => {
      console.log(queryResult);
      await dropDownloadCount(catalystApp);
      await addDummyRow(zcql);
    });
  }
}

async function dropDownloadCount(catalystApp) {
  console.log("dropDownloadCount called ");

  let zcql = catalystApp.zcql();
  var queryHere = "select * from  DownloadCount";
  console.log("queryHere is  " + queryHere);
  let queryResult = await zcql.executeZCQLQuery(queryHere);
  console.log(queryResult);
  let rowid = queryResult[0].DownloadCount.ROWID;
  let datastore = catalystApp.datastore();
  let table = datastore.table("DownloadCount");
  let rowPromise = table.deleteRow(rowid);
  rowPromise.then((row) => {
    console.log(row);
  });
}

async function addDummyRow(zcql) {
  console.log("add dummy row ...");
  //insert an initial row with 0 as the downloadct
  var queryHere_Insert = "insert into DownloadCount(downloadct) values ('0')";
  console.log("insert a dummy row query  " + queryHere_Insert);
  let zcqlPromise_insert = zcql.executeZCQLQuery(queryHere_Insert);
  zcqlPromise_insert.then((queryResult) => {
    console.log(queryResult);
  });
}

module.exports = app;
