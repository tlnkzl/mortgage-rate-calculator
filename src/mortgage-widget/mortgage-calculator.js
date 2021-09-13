var calculatorInitialized = false;

var askingPriceField;
var downPercentField;
var downAmountField;
var mortgageRequiredField;
var paymentPeriodField;
var mortgageRateField;
var monthlyPaymentField;

// fetch reference for the div with id 'zuvafetest' to later inject UI into
const container = document.getElementById('zuvafetest');

window.onload = () => {
  initializeCalculator();
};

function initializeCalculator(method) {
  initCSS();
  initHTMLBody();
  getReferences(); // fetches references for input fields injected by init function above
  setEventListeners(); // sets event listeners for the input fields fetched above
  initDefaultFields(); // sets up default values in asking price input field
}

function initCSS() {
  //injects css link to the head element of the html doc
  console.log('initializing css');
  var link = document.createElement('link');
  link.href = './mortgage-widget/css/styles.css';
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].appendChild(link);
}

function initHTMLBody() {
  // defining html body for injecting
  let htmlBody = `
  <div class="mortgage-calculator-widget">
  <div class="mortgage-container">
  <div class="first-row">
    <p> Asking Price </p>
    <input class="input-style" id="asking-price" type="number" prefix="$" min="0" />
    <button class="go-btn" type="button" onClick={initForm()}> GO </button>
  </div>
  <div class="second-row">
    <p class="normal-title"> Down Payment </p>
    <div class="inner-div">
      <input class="input-style" id="down-percent" placeholder="0.00%" type="number" />
      <input class="input-style" id="down-amount" placeholder="$0" type="number" />
    </div>
  </div>
  <div class="third-row">
    <p class="bold-title"> Total Mortgage Required </p>
    <input class="input-style" id="mortgage-amount" type="number" readOnly />
  </div>
  <div class="fourth-row">
    <p class="normal-title"> Amorzitation Period </p>
    <select id="payment-period" class="year-select">
      <option value="" hidden>
        Select
      </option>
      <option value="5">5 Years</option>
      <option value="10">10 Years</option>
      <option value="15">15 Years</option>
      <option value="20">20 Years</option>
      <option value="25">25 Years</option>
      <option value="30">30 Years</option>
    </select>
  </div>
  <div class="fifth-row">
    <p class="normal-title"> Mortgage Rate </p>
    <input class="input-style" id="mortgage-rate" placeholder="0.00%" type="number" />
  </div>
  <div class="sixth-row">
    <p> Total Mortgage Payment (Monthly)</p>
    <input class="input-style" id="monthly-payment" type="number" readOnly />
  </div>
</div>
  </div>
  `;
  // appeding html to the div
  container.innerHTML = htmlBody;
}

function initDefaultFields() {
  askingPriceField.value = 550000;
}

function getReferences() {
  //doesnt exist in this project yet
  askingPriceField = document.getElementById('asking-price');
  downPercentField = document.getElementById('down-percent');
  downAmountField = document.getElementById('down-amount');
  mortgageRequiredField = document.getElementById('mortgage-amount');
  paymentPeriodField = document.getElementById('payment-period');
  mortgageRateField = document.getElementById('mortgage-rate');
  monthlyPaymentField = document.getElementById('monthly-payment');
}

function setEventListeners() {
  askingPriceField.addEventListener('blur', function (event) {
    if (calculatorInitialized) {
      recalculate();
    }
  });

  //changed event type from 'keyup' to 'blur' to let user delete/edit input field values without validating input at every key press
  downPercentField.addEventListener('blur', function (event) {
    if (calculatorInitialized) {
      calculateDownAmount();
      calculateMortgageRequired();
      calculateMonthlyPayment();
    }
  });

  downAmountField.addEventListener('blur', function (event) {
    if (calculatorInitialized) {
      calculateDownPercent();
      calculateMortgageRequired();
      calculateMonthlyPayment();
    }
  });
  paymentPeriodField.addEventListener('click', function (event) {
    if (calculatorInitialized) recalculate();
  });
  mortgageRateField.addEventListener('blur', function (event) {
    if (calculatorInitialized) handleMortgageRate();
  });
}

function initForm() {
  downPercentField.value = 20;
  paymentPeriodField.value = 25;
  mortgageRateField.value = (2).toFixed(2);
  //make fields editable
  downPercentField.readOnly = false;
  downAmountField.readOnly = false;
  paymentPeriodField.disabled = false;
  mortgageRateField.readOnly = false;

  //calculate initial stuff
  recalculate();
  calculatorInitialized = true;
}

function recalculate() {
  if (askingPriceField.value == '') {
    //don't allow NaN values for asking price
    askingPriceField.value = 0;
  }
  let total = parseFloat(askingPriceField.value);
  if (total < 0) {
    //dont allow negative asking price
    askingPriceField.value = 0;
  }
  downAmountField.max = askingPriceField.value;
  calculateDownAmount();
  calculateMortgageRequired();
  calculateMonthlyPayment();
  calculateMonthlyPayment();
}

function calculateDownAmount() {
  if (downPercentField.value == '') {
    downPercentField.value = (5).toFixed(2);
  }
  if (askingPriceField.value == '') {
    askingPriceField.value = 1;
  }
  var percent = parseFloat(downPercentField.value);
  if (percent < 5) {
    downPercentField.value = (5).toFixed(2);
    percent = 5;
  }
  var total = parseFloat(askingPriceField.value);
  if (percent > 100) {
    //down payment percentage should not be greater than 100%
    downPercentField.value = 100;
    downAmountField.value = total;
    return;
  }
  downAmountField.value = (total * (percent / 100)).toFixed(0);
}

function calculateDownPercent() {
  var amount = parseFloat(downAmountField.value);
  var total = parseFloat(askingPriceField.value);
  console.log('amount: ' + amount + ' | total: ' + total);
  if (amount > total) {
    //down payment amount should not be more than total asking price
    downAmountField.value = total;
    downPercentField.value = (100).toFixed(0);
    return;
  }
  let percent = ((amount / total) * 100).toFixed(2);
  if (percent < 5) {
    //dont allow downpayment amounts lower than 5% of asking price
    percent = 5.0;
    downAmountField.value = (total * (percent / 100)).toFixed(0);
  }
  downPercentField.value = percent;
}

function calculateMortgageRequired() {
  mortgageRequiredField.value = askingPriceField.value - downAmountField.value;
}

function handleMortgageRate() {
  if (mortgageRateField.value == '') {
    mortgageRateField.value = (2).toFixed(2);
  }
  let rate = parseFloat(mortgageRateField.value);
  if (rate <= 0) {
    mortgageRateField.value = (2).toFixed(2);
  }
  recalculate();
}

function calculateMonthlyPayment() {
  let total = parseFloat(mortgageRequiredField.value);
  let term = parseFloat(paymentPeriodField.value);
  let interest = parseFloat(mortgageRateField.value);
  let monthlyRate = interest / 1200;
  let totalMonths = 12 * term;
  var monthlyPayment =
    (total * monthlyRate) / (1 - Math.pow(1 + monthlyRate, totalMonths * -1));
  monthlyPaymentField.value = monthlyPayment.toFixed(0);
}
