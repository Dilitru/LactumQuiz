//LIST OF ANSWERS
const correctAnswers = ["C", "A", "B"];
let questionNumber = parseInt(localStorage.getItem("questionNumber")) || 1;


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


/*
--- DEBUG MODE SWITCH---
*/
let debug = true; //DEBUG MODE switch

/*
-----On load: Checkpoint and debug mode-----
*/
//This is the checkpoint/save system
window.onload = function() {
  // Get checkpoint from localStorage
  const checkpointValue = localStorage.getItem("checkpoint");

  if (!checkpointValue) {
    console.log("New game started");
  }
  
  if(questionNumber == 1){
	  localStorage.setItem("questionNumber", 1);
  }

  // If nothing saved yet, default to step 1
  const checkpoint = checkpointValue ? parseInt(checkpointValue) : 1;
  //displays the proper checkpoint
  switch (checkpoint) {
    case 1:
      document.getElementById("infoEntryPage").classList.remove("hidden");
      break;    
	case 2:
      document.getElementById("question1Page").classList.remove("hidden");
      break;    
	case 3:
      document.getElementById("answer1Page").classList.remove("hidden");
      break;   
	case 4:
      document.getElementById("question2Page").classList.remove("hidden");
      break; 
	case 5:
      document.getElementById("answer2Page").classList.remove("hidden");
      break;  
	case 6:
      document.getElementById("question3Page").classList.remove("hidden");
    break;  
	case 7:
      document.getElementById("answer3Page").classList.remove("hidden");
    break;  
	case 8:
      document.getElementById("decodePage").classList.remove("hidden");
    break; 
	case 9:
	  document.getElementById("000Page").classList.remove("hidden");
	break;
	case 10:
	  document.getElementById("secretPage").classList.remove("hidden");
	break;
	case 11:
	  document.getElementById("revealPage").classList.remove("hidden");
	break;
  }
  
  //hides debug tools if debug is false
  if (debug == false){
	  document.getElementById("resetBtn").classList.add("hidden");
	  document.getElementById("answer1Debug").classList.add("hidden");
	  document.getElementById("answer2Debug").classList.add("hidden");
	  document.getElementById("answer3Debug").classList.add("hidden");
	  document.getElementById("000PageHint").classList.add("hidden");
	  document.getElementById("decodePageHint").classList.add("hidden");
	  document.getElementById("secretPageHint").classList.add("hidden");
  }
};

//Reset Button
document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("checkpoint");
  localStorage.removeItem("tableNumber");
  localStorage.removeItem("playerName");
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

//Table and name entry
document.getElementById("nextBtn").addEventListener("click", () => {
  const tableNumber = document.getElementById("tableNumber").value;
  const playerName = document.getElementById("playerName").value;

  if (!tableNumber || !playerName) {
    alert("Please fill in both fields.");
    return;
  }

  // Save checkpoint data, add +1 to checkpoint;
  localStorage.setItem("tableNumber", tableNumber);
  localStorage.setItem("playerName", playerName);
  sendPlayerName(playerName);
  
  
  advanceCheckpoint();

  console.log(`Checkpoint saved!\nTable: ${tableNumber}\nName: ${playerName}`);
  document.getElementById("infoEntryPage").classList.add("hidden");
  document.getElementById("question1Page").classList.remove("hidden");
});

// Separate function to send playerName
function sendPlayerName(playerName) {
  if (!playerName) {
    alert("Please enter a name first.");
    return;
  }

  db.collection("submissions").add({
    type: "name",
    playerName: playerName, // use playerName instead of name
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("Player name submitted:", playerName);
   })
  .catch((err) => {
    console.error("Error adding document:", err);
  });
}

/*
--- Question 1 Page functions ---
*/
// Handle hotspot click
document.getElementById("q1spot").addEventListener("click", () => {
  console.log("Question 1 hotspot clicked");

  advanceCheckpoint();

  // Hide question page, show answer page
  document.getElementById("question1Page").classList.add("hidden");
  document.getElementById("answer1Page").classList.remove("hidden");
});

/*
--- Question 2 Page functions ---
*/
// Handle hotspot click
document.getElementById("q2spot").addEventListener("click", () => {
  console.log("Question 2 hotspot clicked");

  advanceCheckpoint();

  // Hide question page, show answer page
  document.getElementById("question2Page").classList.add("hidden");
  document.getElementById("answer2Page").classList.remove("hidden");
});

/*
--- Question 3 Page functions ---
*/
// Handle hotspot click
document.getElementById("q3spot").addEventListener("click", () => {
  console.log("Question 3 hotspot clicked");

  advanceCheckpoint();

  // Hide question page, show answer page
  document.getElementById("question3Page").classList.add("hidden");
  document.getElementById("answer3Page").classList.remove("hidden");
});

/*
--- Answer Pages functions ---
Answer pages all use the same function, unlike Question 1,2,3, etc.
*/
document.querySelectorAll(".answer-buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
    checkAnswer(btn.textContent); // "A", "B", or "C"
  });
});

// Function: check if answer is correct
// Function: check answer and show message
function checkAnswer(answer) {
  console.log("Answer " + answer + " chosen");
  const correct = correctAnswers[questionNumber - 1]; 

  if (answer === correct) {
	console.log("Answer " + answer + " is correct");
    showAlert("Answer Submitted");
    //sendToFirestore(answer);
	
  sendTableAndQuestion();
  } else {
	console.log("Answer " + answer + " is wrong");
    showAlert("Answer Submitted");
    //sendToFirestore(answer); // still record wrong answers
  }

  // Advance regardless of correctness
  goToNextSection();
  
}

function sendTableAndQuestion() {
  // Get values from localStorage
  const tableNumber = localStorage.getItem("tableNumber");
  const questionNumber = localStorage.getItem("questionNumber");
  console.log("tableNumber from localStorage:", tableNumber);
  console.log("questionNumber from localStorage:", questionNumber);


  
  if (!tableNumber || !questionNumber) {
    console.error("Missing tableNumber or questionNumber in localStorage");
    return;
  }

  db.collection("submissions").add({
    type: "answer",
    tableNumber: parseInt(tableNumber, 10),   // store as number
    questionNumber: parseInt(questionNumber, 10),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log(`Sent: table ${tableNumber}, question ${questionNumber}`);
  })
  .catch((err) => {
    console.error("Error adding document:", err);
  });
}

function goToNextSection() {
  // Hide current section
  const currentSection = document.getElementById(`answer${questionNumber}Page`);
  if (currentSection) currentSection.classList.add("hidden");

  // Advance question number and checkpoint
  advanceQuestionNumber();
  advanceCheckpoint();

  // Decide next section based on new questionNumber
  if (questionNumber === 2) {
    document.getElementById("question2Page").classList.remove("hidden");
  } else if (questionNumber === 3) {
    document.getElementById("question3Page").classList.remove("hidden");
  } else if (questionNumber === 4) {
    document.getElementById("decodePage").classList.remove("hidden");
  }
}

//Advances Question Number
function advanceQuestionNumber() {
  questionNumber++;
  localStorage.setItem("questionNumber", questionNumber);
  console.log("Question number advanced to:", questionNumber);
}

/*
--- DECODE page functions ---
*/
const pinInputs = document.querySelectorAll('.pin-input');

pinInputs.forEach((input, idx) => {
  input.addEventListener('input', () => {
    // Restrict to 1 digit
    if (input.value.length > 1) {
      input.value = input.value.slice(0,1);
    }
    // Auto‑advance focus
    if (input.value.length === 1 && idx < pinInputs.length - 1) {
      pinInputs[idx + 1].focus();
    }
  });
});

document.getElementById("decodeBtn").addEventListener("click", () => {
  const num1El = document.getElementById("num1");
  const num2El = document.getElementById("num2");
  const num3El = document.getElementById("num3");

  const num1 = parseInt(num1El.value, 10) || 0;
  const num2 = parseInt(num2El.value, 10) || 0;
  const num3 = parseInt(num3El.value, 10) || 0;

  if (num1 === 0 && num2 === 0 && num3 === 0) {
    // Hide decodePage
    document.getElementById("decodePage").classList.add("hidden");
    // Show next section
    document.getElementById("000Page").classList.remove("hidden");
    // Advance checkpoint
    advanceCheckpoint();
  } else {
    alert("Equation incorrect. Try again!");
    // Reset inputs
    num1El.value = "";
    num2El.value = "";
    num3El.value = "";
    num1El.focus(); // put cursor back on first box
  }
});


/*
--- 000 Page Functions ---
*/
const zeroButtons = document.querySelectorAll('.zero-btn');
let pressed = { zero1: false, zero2: false, zero3: false };

zeroButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    pressed[btn.id] = true;

    // Check if all three have been pressed
    if (pressed.zero1 && pressed.zero2 && pressed.zero3) {
      // Hide 000Page
      document.getElementById("000Page").classList.add("hidden");
      // Show revealPage
      document.getElementById("secretPage").classList.remove("hidden");
      // Advance checkpoint
      advanceCheckpoint();
    }
  });
});

/*
--- Secret Page Function ---
*/
let hotspotClicks = 0;

document.getElementById("milkCanHotspot").addEventListener("click", () => {
  hotspotClicks++;
  if (hotspotClicks >= 3) {
    // Hide SecretPage
    document.getElementById("secretPage").classList.add("hidden");
    // Show RevealPage
    document.getElementById("revealPage").classList.remove("hidden");
    // Advance checkpoint
    advanceCheckpoint();
  }
});

/*
--- Misc Repeating functions ---
*/

// SHOW MESSAGE FUNCTION
function showMessage(text) {
  const msgBox = document.createElement("div");
  msgBox.textContent = text;

  // Style the floating card
  msgBox.style.position = "fixed";       // stays in place
  msgBox.style.top = "50%";              // halfway down the screen
  msgBox.style.left = "50%";             // halfway across the screen
  msgBox.style.transform = "translate(-50%, -50%)"; // perfectly centered
  msgBox.style.background = "#fff";      // white card
  msgBox.style.padding = "30px 60px";
  msgBox.style.borderRadius = "10px";
  msgBox.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
  msgBox.style.fontSize = "1.5rem";
  msgBox.style.fontWeight = "bold";
  msgBox.style.zIndex = "9999";          // on top of everything
  msgBox.style.textAlign = "center";

  document.body.appendChild(msgBox);

  // Auto-hide after 2 seconds
  setTimeout(() => {
    msgBox.remove();
  }, 3000);
}

//SHOW ALERT FUNCTION
function showAlert(text) {
  const alertBox = document.createElement("div");

  // Style the floating card
  alertBox.style.position = "fixed";
  alertBox.style.top = "50%";
  alertBox.style.left = "50%";
  alertBox.style.transform = "translate(-50%, -50%)";
  alertBox.style.background = "#fff";
  alertBox.style.padding = "30px 30px";
  alertBox.style.borderRadius = "10px";
  alertBox.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
  alertBox.style.fontSize = "3rem";
  alertBox.style.fontWeight = "bold";
  alertBox.style.zIndex = "9999";
  alertBox.style.textAlign = "center";

  // Add message text
  const msgText = document.createElement("div");
  msgText.textContent = text;
  msgText.style.marginBottom = "20px";

  // Add OK button
  const okButton = document.createElement("button");
  okButton.textContent = "PROCEED";
  okButton.style.fontSize = "3rem";
  okButton.style.padding = "10px 20px";
  okButton.style.borderRadius = "6px";
  okButton.style.cursor = "pointer";

  // Close alert when OK is clicked
  okButton.addEventListener("click", () => {
    alertBox.remove();
  });

  // Append elements
  alertBox.appendChild(msgText);
  alertBox.appendChild(okButton);
  document.body.appendChild(alertBox);
}

																		






