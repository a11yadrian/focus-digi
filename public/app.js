const mysql = require('mysql');

document.getElementById('start-button').addEventListener('click', startTest);
document.getElementById('next').addEventListener('click', startTest);

let digitAmount = 1;
let digits = generateDigits(digitAmount);
let currentDigitIndex = 0;

function generateDigits(length) {
    let digits = [];
    for (let i = 0; i < length; i++) {
        digits.push(Math.floor(Math.random() * 10));
    }
    return digits;
}

function displayNextDigit() {
    if (currentDigitIndex < digits.length) {
        document.getElementById('digit-display').innerText = digits[currentDigitIndex];
        currentDigitIndex++;
        lightUpIndicator();
        setTimeout(displayNextDigit, 1000); // Display next digit after 1 second
    } else {
        endTest();
    }
}

function startTest() {
if (document.getElementById('next').style.display !== 'none') {
        digitAmount++; // Increase digitAmount for the next round
        digits = generateDigits(digitAmount); // Generate new digits array
    }
    currentDigitIndex = 0; // Reset the current digit index for new round

    document.getElementById('start-button').style.display = 'none';
    document.getElementById('title').style.display = 'block';
    document.getElementById('description').style.display = 'none';
    document.getElementById('user-input').style.display = 'none';
    document.getElementById('submit-button').style.display = 'none';
    document.getElementById('digit-display').style.display = 'block';
    document.getElementById('correct').style.display = 'none';
    document.getElementById('next').style.display = 'none';
    document.getElementById('user-input').value = ''; //Reset User Input from last round
    displayNextDigit();
}

function endTest() {
    document.getElementById('digit-display').style.display = 'none';
    document.getElementById('user-input').style.display = 'block';
    document.getElementById('submit-button').style.display = 'block';
    document.getElementById('title').style.display = 'none';
}

document.getElementById('submit-button').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value;
    if(userInput == digits.join('')){
        document.getElementById('correct').style.display = 'block';
        document.getElementById('next').style.display = 'block';
    } else{
        document.getElementById('false').style.display = 'block';
    }
    submitResult(userInput); // only submit in false case
});

function lightUpIndicator() {
    const indicator = document.getElementById('indicator');
    indicator.style.opacity = 1;
    setTimeout(() => {
        indicator.style.opacity = 0;
    }, 250); // Light up for 0.25 seconds
}


async function submitResult(result) {
    try {
      const response = await fetch('/api/submit', {  // Ensure the URL is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ result }),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
  
      const data = await response.json();
      alert(`Result submitted. Your rank is: ${data.rank}`);
    } catch (error) {
      console.error('Error submitting result:', error);
      alert('There was an error submitting your result. Please try again later.');
    }
  }
  