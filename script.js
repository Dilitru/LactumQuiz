/*
--- DEBUG MODE SWITCH---
*/
let debug = true; //DEBUG MODE switch

/*
--- Firebase setup ---
*/
// Replace with your Firebase config
    const firebaseConfig = {
      apiKey: "AIzaSyCv6nPwgzTl7qDNSZ1MkpoGAOHyxpkKL4s",
		authDomain: "quizapp-cf724.firebaseapp.com",
		databaseURL: "https://quizapp-cf724-default-rtdb.asia-southeast1.firebasedatabase.app",
		projectId: "quizapp-cf724",
		storageBucket: "quizapp-cf724.firebasestorage.app",
		messagingSenderId: "948696897116",
		appId: "1:948696897116:web:8d8bf48e0b818ace0ef899",
		measurementId: "G-MLNBNFC70Y"
    };

    // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize Firestore
  const db = firebase.firestore();

let questionNumber = parseInt(localStorage.getItem("questionNumber")) || 1;
window.onload = function() {
  // Get checkpoint from localStorage
  const checkpointValue = localStorage.getItem("checkpoint");

  if (!checkpointValue) {
    console.log("New game started");
  }
  
  if(questionNumber == 1){
	  localStorage.setItem("questionNumber", 1);
  }
  
  const checkpoint = checkpointValue ? parseInt(checkpointValue) : 1;
  
  switch (checkpoint) {
    case 1:
      document.getElementById("infoEntryPage").classList.remove("hidden");
      break;    
	case 2:
      document.getElementById("readyPage").classList.remove("hidden");
      break;
    case 3:
      showQuestion();
      break;
    case 4:
      document.getElementById("readyPage").classList.remove("hidden");
      break;
    case 5:
      showQuestion();
      break;
    case 6:
      document.getElementById("readyPage").classList.remove("hidden");
      break;
    case 7:
      showQuestion();
      break;
    case 8:
      document.getElementById("readyPage").classList.remove("hidden");
      break;
    case 9:
      showQuestion();
      break;
    case 10:
      document.getElementById("readyPage").classList.remove("hidden");
      break;
    case 11:
      showQuestion();
      break;
    case 12:
      document.getElementById("congratsPage").classList.remove("hidden");
      break;
  }

  if (debug == true){
    document.getElementById("resetBtn").classList.remove("hidden");
    document.getElementById("proceedBtn").classList.add("hidden");
    document.getElementById("bypass-btn").classList.remove("hidden");
  }
}

//Reset Button
document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("checkpoint");
  localStorage.removeItem("tableNumber");
  localStorage.removeItem("questionNumber");
  console.log("Checkpoint cleared. New game will start next load.");
  alert("Checkpoint reset! Reload the page to start fresh.");
});

// Advance Checkpoint: increase checkpoint by +1
function advanceCheckpoint() {
  let checkpointValue = localStorage.getItem("checkpoint");
  let checkpoint = checkpointValue ? parseInt(checkpointValue) : 1;

  checkpoint++; // move forward one step
  localStorage.setItem("checkpoint", checkpoint);

  console.log("Checkpoint advanced to:", checkpoint);
}

//Table Entry
document.getElementById("nextBtn").addEventListener("click", () => {
  const tableNumber = document.getElementById("tableNumber").value;
  if (!tableNumber) {
    alert("Please enter yout table number.");
    return;
  }

  // Save checkpoint data, add +1 to checkpoint;
  localStorage.setItem("tableNumber", tableNumber);
  
  advanceCheckpoint();

  console.log(`Checkpoint saved!\nTable: ${tableNumber}`);
  document.getElementById("infoEntryPage").classList.add("hidden");
  document.getElementById("readyPage").classList.remove("hidden");
});

// Firestore reference to the statusDoc
const statusRef = db.collection("status").doc("statusDoc");

// Local memory copy of the status array
let questionStatus = [false, false, false, false, false];

// Attach event listener to the PROCEED button
document.querySelector(".proceed-btn").addEventListener("click", async () => {
  try {
    // Get the current status array from Firestore
    const doc = await statusRef.get();
    if (doc.exists) {
      // Save the array in memory
      questionStatus = doc.data().status;

      console.log("Question status array saved in memory:", questionStatus);

      //alert("Status loaded into memory!");
	  if (isQuestionUnlocked() == true){
		  console.log("showingnexQage");
          advanceCheckpoint();
		  showQuestion();
	  } else {
		  console.log("showinglockedpage");
		  showLockedPage();
	  }
	  
    } else {
      console.error("statusDoc not found!");
    }
  } catch (error) {
    console.error("Error fetching status:", error);
  }
});


function isQuestionUnlocked() {
  // Convert to zero-based index
  const index = questionNumber - 1;

  // Safety check: make sure index is valid
  if (index < 0 || index >= questionStatus.length) {
    console.error("Invalid question number:", questionNumber);
    return false;
  }
  
  console.log("question index: " + index + " status: "+ questionStatus[0]);
  return questionStatus[index];
}

function showLockedPage() {
  document.getElementById("readyPage").classList.add("hidden");
  document.getElementById("readyPage").style.display = "none";
  document.getElementById("questionLockedPage").classList.remove("hidden");
  const okBtn = document.getElementById("okButton");
  let countdown = 5; // seconds

  // Disable button and set initial label
  okBtn.disabled = true;
  okBtn.textContent = `OK (${countdown})`;

  // Countdown interval
  const timer = setInterval(() => {
    countdown--;

    if (countdown > 0) {
      okBtn.textContent = `OK (${countdown})`;
    } else {
      clearInterval(timer);
      okBtn.textContent = "OK";
      okBtn.disabled = false; // enable after countdown
    }
  }, 1000);
}

// Attach event listener to OK button
document.getElementById("okButton").addEventListener("click", () => {
  console.log("OK pressed, returning to ready check...");
  // TODO: add navigation logic here
  document.getElementById("readyPage").classList.remove("hidden");
  document.getElementById("readyPage").style.display = "block";
  document.getElementById("questionLockedPage").classList.add("hidden");
});

const words = ["POVERTY", "DHA", "BRAIN", "SYNAPSE", "DHASURV"];
let currentWord = "";
let targetWord = "";

function showQuestion() {
  const letterButtonsDiv = document.getElementById("letterButtons");
  letterButtonsDiv.innerHTML = "";
  currentWord = "";
  document.getElementById("unscrambledWord").textContent = "";

  targetWord = words[questionNumber - 1];
  const shuffled = targetWord.split("").sort(() => Math.random() - 0.5);

  shuffled.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.onclick = () => addLetter(letter,btn);
    letterButtonsDiv.appendChild(btn);
  });

  // Show question page, hide congrats page
  document.getElementById("questionPage").style.display = "block";
  document.getElementById("readyPage").style.display = "none";
  document.getElementById("congratsPage").style.display = "none";
}

function addLetter(letter, btnElement) {
  const nextIndex = currentWord.length;

  if (letter === targetWord[nextIndex]) {
    currentWord += letter;
    document.getElementById("unscrambledWord").textContent = currentWord;

    // Hide the button once it's correctly used
    btnElement.classList.add("hidden");

    // Check if finished
    if (currentWord === targetWord) {
      advanceCheckpoint();
      advanceQuestionNumber();
      document.getElementById("questionPage").style.display = "none";
      document.getElementById("congratsPage").style.display = "block";
    }
  } else {
    alert("Wrong letter pressed!");
  }
}

function renderButtons(letters) {
  const letterButtonsDiv = document.getElementById("letterButtons");
  letters.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;

    // Pass both the letter and the button element itself
    btn.onclick = () => addLetter(letter, btn);

    letterButtonsDiv.appendChild(btn);
  });
}

function nextQuestion() {
  if (questionNumber <= words.length) {
    document.getElementById("readyPage").style.display = "block";
    document.getElementById("congratsPage").style.display = "none";
  } else {
    alert("All questions completed!");
    // TODO: handle end of game flow
  }
}

function advanceQuestionNumber() {
  questionNumber++;
  localStorage.setItem("questionNumber", questionNumber);
  console.log("Question number advanced to:", questionNumber);
}

document.getElementById("bypass-btn").addEventListener("click", () => {
  advanceCheckpoint();
  console.log("Bypass pressed, showing question directly");
  showQuestion();
});

