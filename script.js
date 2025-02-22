// script.js

const API_URL = "http://localhost:3000";

const calculateLoanTerm = (P, r, PMT) => {
  let n = 0;
  let remainingBalance = P;
  const monthlyInterestRate = r / 12;

  while (remainingBalance > 0) {
      n++;
      remainingBalance = remainingBalance * (1 + monthlyInterestRate) - PMT;
  }

  return n;
}

const calculateSavings = (event) => {
  event.preventDefault();
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
  const interestRate = 0.05;
  const targetSavings = 0.3;

  let monthlyEnergy = billAmount / tnbTariff;
  let dailyEnergy = monthlyEnergy / 30;
  let systemSize = dailyEnergy / (peakSunHours * efficiency);
  let totalSystemCost = systemSize * solarCostPerKw;

  let targetMonthlyPayment = billAmount * (1 - targetSavings);

  const loanTermMonths = calculateLoanTerm(totalSystemCost, interestRate, targetMonthlyPayment);

  const result = {
    systemSize: `${systemSize.toFixed(2)} kWp`,
    systemCost: `RM${totalSystemCost.toFixed(2)}`,
    monthlyPayment: `RM${targetMonthlyPayment.toFixed(2)}`,
    loanTerm: `${loanTermMonths} ${loanTermMonths>1?'months':'month'}`,
  };
  for (const [id, value] of Object.entries(result)) {
    const element = document.getElementById(`${id}`);
   
    if (element) {
      element.value = value;
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
  const icon = document.createElement('ion-icon');
  if(success){
    icon.setAttribute('name', 'checkmark-circle');
  }else{
    icon.setAttribute('name', 'close-circle');
  }
  const textSpan = document.createElement('span');
  textSpan.className = "text-sm";
  textSpan.textContent = "You have successfully submitted the callback request!";
  msgDiv.appendChild(icon);
  msgDiv.appendChild(textSpan);
  document.getElementById('msgArea').prepend(msgDiv);

  setTimeout(() => {
    msgDiv.remove();
  }, 3000);
}

const print = () => {
  if (window.jspdf) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("times", "bold");
    const title = "Estimated Solar Cost & Saving"
    doc.text(title, 20, 20); 
    const textWidth = doc.getTextWidth(title); 
    const textHeight = doc.getTextDimensions(title).h;
    doc.line(20, 22, 20 + textWidth, 22);
  
    const result = {
      systemSize: "Recommended System Size",
      systemCost: "Estimated System Cost",
      monthlyPayment: "Target Monthly Payment",
      loanTerm: "Estimated Loan Term",
    };
    let yCoordinate = 20 + textHeight + 5;
   
    for (const [id, label] of Object.entries(result)) {
      doc.setFont("times", "bold");
      doc.setTextColor(128, 128, 128);
      doc.setFontSize(9);
      doc.text(label,20,yCoordinate);
      yCoordinate+=5;
      const element = document.getElementById(`${id}`);
      doc.setFont("times", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(element.value,20,yCoordinate)
      yCoordinate+=8;
    }

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  } else {
    console.error("jsPDF is not loaded properly.");
  }
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
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("print").addEventListener("click",print);
});
