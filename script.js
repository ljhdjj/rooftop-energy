// script.js

const API_URL = 'http://localhost:3000';

function calculateSavings() {
    let billAmount = parseFloat(document.getElementById("bill").value);

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


    document.getElementById("results").innerHTML = `
        <p>Recommended System Size: ${systemSize.toFixed(2)} kWp</p>
        <p>Estimated System Cost: RM${totalSystemCost.toFixed(2)}</p>
        <p>Target Monthly Payment: RM${targetMonthlyPayment.toFixed(2)}</p>
        <p>Estimated Loan Term: ${n} months</p>  
    `;

    
}

const printQuote = () => {
    window.print();
}

const submitForm = async (event) => {
    event.preventDefault();
    console.log('submit');
 
    const form = event.target;
    const formData = new FormData(form);
   
   

    if (!formData.get("name") || !formData.get("phone")) {
        alert("Please enter your name and phone/email.");
        return;
    }

    try{
        const response = await fetch('http://localhost:3000/submit',{
            method:'POST',
            body:formData 
        });
        const result = await response.json();
        console.log(result);
    }catch(error){
        console.error(error);
    }

    
}
document.getElementById('calculate-btn').addEventListener('click', calculateSavings);
document.getElementById('print-btn').addEventListener('click', printQuote); 
document.getElementById('callback').addEventListener('submit', submitForm); 