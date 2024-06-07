document.getElementById('start-button').addEventListener('click', startTest);
document.getElementById('next').addEventListener('click', startTest);

let digitAmount = 1;
let digits = generateDigits(digitAmount); // current round
let currentDigitIndex = 0;

let timer;
let startTime;
let elapsedTime = 0;

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

    startTime = Date.now();
    timer = setInterval(updateTimer, 1000);

    document.getElementById('start-button').style.display = 'none';
    document.getElementById('title').style.display = 'block';
    document.getElementById('description').style.display = 'none';
    document.getElementById('digit-display').style.display = 'block';
    document.getElementById('correct').style.display = 'none';
    document.getElementById('next').style.display = 'none';
    document.getElementById('user-input').value = ''; //Reset User Input from last round
    displayNextDigit();
}

function updateTimer() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

function endTest() {
    document.getElementById('digit-display').style.display = 'none';
    document.getElementById('user-input').style.display = 'block';
    document.getElementById('submit-button').style.display = 'block';
    document.getElementById('title').style.display = 'none';
}

document.getElementById('submit-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    document.getElementById('submit-button').style.display = 'none';
    document.getElementById('user-input').style.display = 'none';
    if(userInput == digits.join('')){
        document.getElementById('correct').style.display = 'block';
        document.getElementById('next').style.display = 'block';
    } else{
        document.getElementById('false').style.display = 'block';
        stopTimer();
        document.getElementById('loading-indicator').style.display = 'block';
        const resultData = await submitResult(digitAmount, elapsedTime);
        document.getElementById('loading-indicator').style.display = 'none';
        if (resultData) {
            const { rank, totalResults } = result;
            const percentage = Math.floor((rank / totalResults) * 100);
            showResult(`Dein Rang ist ${rank}. Du bist in den obersten ${percentage}% der Benutzer.`);
        }
    }
});

function lightUpIndicator() {
    const indicator = document.getElementById('indicator');
    indicator.style.opacity = 1;
    setTimeout(() => {
        indicator.style.opacity = 0;
    }, 250); // Light up for 0.25 seconds
}


async function submitResult(finalRound, time) {
    try {
      const response = await fetch('https://focus-digi.vercel.app/api/submit', {  // Ensure the URL is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ finalRound, time}),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting result:', error);
      alert('There was an error submitting your result. Please try again later.');
      return null;
    }
  }

  function showResult(message) {
    const resultDisplay = document.getElementById('result-display');
    resultDisplay.innerText = message;
    resultDisplay.style.display = 'block';
}
  