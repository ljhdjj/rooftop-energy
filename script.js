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

  if (targetMonthlyPayment > 0) {
    // Avoid division by zero
    while (true) {
      n++;
      let calculatedPayment =
        (loanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, n)) /
        (Math.pow(1 + monthlyInterestRate, n) - 1);
      if (calculatedPayment <= targetMonthlyPayment) {
        break;
      }
    }
  }

  const result = {
    systemSize: `${systemSize.toFixed(2)} kWp`,
    systemCost: `RM${totalSystemCost.toFixed(2)}`,
    monthlyPayment: `RM${targetMonthlyPayment.toFixed(2)}`,
    loanTerm: `RM${targetMonthlyPayment.toFixed(2)}`,
  };
  for (const [id, value] of Object.entries(result)) {
    // Create a new paragraph element
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

const submitForm = async (event) => {
  event.preventDefault();
  console.log("submit");

  const form = event.target;
  const formData = new FormData(form);

  if (!formData.get("name") || !formData.get("phone")) {
    alert("Please enter your name and phone/email.");
    return;
  }

  try {
    const response = await fetch(
      "http://rooftop-energyljh.netlify.app/submit",
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  if (!formData.get("name") || !formData.get("phone")) {
    alert("Please enter your name and phone/email.");
    return;
  }

  try {
    const response = await fetch(
      "http://rooftop-energyljh.netlify.app/submit",
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

const pageChange = (event) => {
  const value = event.target.value;
  console.log(value);
  if (value === "solar-saving-calculator") {
    console.log("adad");
    return;
  }

  if (value === "callback-request") {
    return;
  }
};
// document.getElementById('calculate-btn').addEventListener('click', calculateSavings);
// document.getElementById('print-btn').addEventListener('click', printQuote);
// document.getElementById('callback').addEventListener('submit', submitForm);
document
  .getElementById("calculateForm")
  .addEventListener("submit", calculateSavings);
document.getElementById("close").addEventListener("click", closePopOutWindow);
document.querySelectorAll(".selection").forEach((radio) => {
  radio.addEventListener("change", pageChange);
});
