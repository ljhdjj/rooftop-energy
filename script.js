// script.js
document.getElementById('calculate-btn').addEventListener('click', calculateSavings);
document.getElementById('print-btn').addEventListener('click', printQuote); 
document.getElementById('callback').addEventListener('test1', submitForm); 


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

function printQuote() {
    window.print();
}

function submitForm(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;


    if (!name || !phone) {
        alert("Please enter your name and phone/email.");
        return;
    }

    fetch('/test1', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `name=${name}&phone=${phone}`,
    })
    .then(response => {
        if (!response.ok) { 
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Thank you for your request! We will contact you soon.");
            document.getElementById('callback-form').reset();
        } else {
            alert("Error submitting form. Please try again.");
            console.error("Server error:", data.message); 
        }
    })
    .catch(error => {
        console.error("Fetch/JSON error:", error); 
        if (error.message === "Failed to fetch") {
            alert("Network error. Please check your internet connection and try again.");
        } else if (error.message.startsWith("HTTP error")) {
            alert(error.message); 
        } else if (error instanceof SyntaxError) {
            alert("Error parsing server response. Please try again later.");
        } else {
            alert("An error occurred. Please try again later.");
        }
    });
}
