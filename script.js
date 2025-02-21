// script.js

const API_URL = "http://localhost:3000";

function calculateSavings(event) {
  event.preventDefault();
  console.log("adad");
  const formData = new FormData(event.target);
  const billAmount = formData.get("bill");

  if (!billAmount || billAmount <= 0) {
    alert("Please enter a valid bill amount.");
    return;
  }

  const tnbTariff = 0.509;
  const solarCostPerKw = 3000;
  const peakSunHours = 3;
  const efficiency = 0.8;
  const interestRate = 0.05; // 5% annual interest
  const targetSavings = 0.3; // 30% savings

  let monthlyEnergy = billAmount / tnbTariff;
  let dailyEnergy = monthlyEnergy / 30;
  let systemSize = dailyEnergy / (peakSunHours * efficiency);
  let totalSystemCost = systemSize * solarCostPerKw;

  let targetMonthlyPayment = billAmount * (1 - targetSavings);

  // Loan term calculation (iterative approach)
  let n = 0;
  let monthlyInterestRate = interestRate / 12;
  let loanAmount = totalSystemCost;

  if(targetMonthlyPayment > 0) { // Avoid division by zero
    while (true) {
        n++;
        let calculatedPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, n)) / (Math.pow(1 + monthlyInterestRate, n) - 1);
        if (calculatedPayment <= targetMonthlyPayment) {
            break;
        }
    }
  }

  const result = {
    systemSize: `${systemSize.toFixed(2)} kWp`,
    systemCost: `RM${totalSystemCost.toFixed(2)}`,
    monthlyPayment: `RM${targetMonthlyPayment.toFixed(2)}`,
    loanTerm: `${n} ${n>1?'months':'month'}`,
  };
  for (const [id, value] of Object.entries(result)) {
    const element = document.getElementById(`${id}`);
    if (element) {
      element.innerHTML = value;
    }
  }
  document.getElementById("overlay").classList.remove("!opacity-0", "!z-0");
}

const closePopOutWindow = () => {
  document.getElementById("overlay").classList.add("!opacity-0");
  setTimeout(() => {
    document.getElementById("overlay").classList.add("!z-0");
  }, 200);
};

const printQuote = () => {
  window.print();
};
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const submitForm = async (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  
  if (!formData.get("name") || !formData.get("phone")) {
    alert("Please enter your name and phone/email.");
    return;
  }
  const phoneOrEmail = formData.get("phone")
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phoneOrEmail);
  const isPhone = /^\+?[0-9]{7,15}(-[0-9]{1,15})*$/.test(phoneOrEmail);
  if(!isEmail && !isPhone){
    document.getElementById('phone').classList.add('error')
    document.querySelector('.errorLabel').classList.remove('!hidden');
    return;
  }
 
  document.getElementById('loading').classList.add('show');
  try {
    const response = await fetch(
      `${API_URL}/submit`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    if(result?.success){
      message(true);
    }else{
      message(false);
    }
  } catch (error) {
    message(false);
    console.error(error);
  }finally{
    document.getElementById('loading').classList.remove('show');
    document.getElementById('name').value='';
    document.getElementById('phone').value='';
  }

};

const pageChange = (event) => {
  const value = event.target.value;
  let hideContainer = "solarSavingCalculatorContainer";
  if (value === "solarSavingCalculatorContainer") {
    hideContainer = "callbackRequestContainer";
    document.getElementById(`${value}`).classList.remove('!hidden');
  }

  if (value === "callbackRequestContainer") {
    document.getElementById(`${value}`).classList.remove('!hidden');
  }
  document.getElementById(`${hideContainer}`).classList.add('!hidden');

};

const phoneOrEmailOnInput = (event) => {
  const target = event.target;
  if (target.classList.contains('error')) {
    const value = target.value.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isPhone = /^\+?[0-9]{7,15}(-[0-9]{1,15})*$/.test(value);
    if(isPhone || isEmail){
      target.classList.remove('error');
      document.querySelector('.errorLabel').classList.add('!hidden');
    }
  } 
}

const message = (success)=>{
  
  const msgDiv = document.createElement('div');
  let classname = "errorMsg"
  if(success){
    classname = "successMsg";
  }

  msgDiv.className = classname;
  // Create the icon
  const icon = document.createElement('ion-icon');
  if(success){
    icon.setAttribute('name', 'checkmark-circle');
  }else{
    icon.setAttribute('name', 'close-circle');
  }

  // Create the text span
  const textSpan = document.createElement('span');
  textSpan.className = "text-sm";
  textSpan.textContent = "You have successfully submitted the callback request!";

  // Append elements
  msgDiv.appendChild(icon);
  msgDiv.appendChild(textSpan);
  
  // Append to body
  document.getElementById('msgArea').prepend(msgDiv);

  // Remove the message after 2 seconds
  setTimeout(() => {
    msgDiv.remove();
  }, 10000);
}
document.getElementById('callbackRequestContainer').addEventListener('submit', submitForm);
document
  .getElementById("solarSavingCalculatorContainer")
  .addEventListener("submit", calculateSavings);
document.getElementById("close").addEventListener("click", closePopOutWindow);
document.querySelectorAll(".selection").forEach((radio) => {
  radio.addEventListener("change", pageChange);
});

document.getElementById('phone').addEventListener('input',phoneOrEmailOnInput);
