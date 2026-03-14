//This is the script.js for the quiz app.
//Sections are commented for easy reading.

// Define all questions here
const questions = [
  {
    question: "1. Which of the following statements about CS-born babies and nutrition is true?",
    answers: ["A. CS delivery may impact gut microbiome diversity at birth.", "B. Lower exposure to beneficial bacteria may lead to short and long-term diseases", "C. Gut dysbiosis may persist up to 7 years old", "D. All of the above"],
    correct: "D. All of the above"
  },
  {
    question: "2. What nutrients support higher-level cognitive skills for A+ Children?",
    answers: ["A. MFGM + DHA", "B. HMO", "C. 2’-FL", "D. None of the above"],
    correct: "A. MFGM + DHA"
  },
  {
    question: "3. A baby is fussy, gassy, and excessively crying. Which benefit helps support them?",
    answers: ["A. Helps shorten diarrhea caused by lactose intolerance", "B. All-in-One Comfort formula with rapid digestive discomfort relief within 24 hours", "C. Helps support stronger immunity with 2'-FL HMO", "D. None of the above"],
    correct: "B. All-in-One Comfort formula with rapid digestive discomfort relief within 24 hours"
  },
  {
    question: "4. A partially hydrolyzed formula with low lactose and MFGM + DHA is clinically proven to:",
    answers: ["A. Provide rapid digestive discomfort relief within 24 hours", "B. Support easier digestion vs. standard milk formula", "C. Support higher level cognitive skills", "D. All of the above"],
    correct: "D. All of the above"
  },
  {
    question: "5. Early supplementation of MFGM+DHA are clinically proven to do which of the following?",
    answers: ["A) Accelerate early milestones", "B) Support long term brain benefits (ex. executive function)", "C) Support faster myelination and improved cognition", "D) All of the above"],
    correct: "D) All of the above"
  },
  {
    question: "6. Which of the following is CORRECT for Enfamil A+ Rice HP? ",
    answers: ["A. Rice HP has ZERO COW’s MILK", "B. Rice HP has ZERO Lactose", "C. Rice HP helps provide ZERO REACTIONs for suspected CMPA & LI", "D. All of the above"],
    correct: "D. All of the above"
  },
  {
    question: "7. (ENFAMAMA QUESITON PENDING) 1 + 1 = ?",
    answers: ["6", "7", "2", "9"],
    correct: "2"
  },
  {
    question: "BONUS: What nutrients can help support gut microbiome diversity for CS-born babies and children?",
    answers: ["A. PDX", "B. GOS", "C. 2'-FL HMO", "D. All of the above"],
    correct: "D. All of the above"
  }
];

/*
--- DEBUG MODE SWITCH---
*/
let debug = true; //DEBUG MODE switch

/*
--- Firebase setup ---
*/
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
--- CHECKPOINT SYSTEM ---
*/
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
let questionStatus = [false, false, false, false, false, false, false, false, false];

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

/*
--- QUIZ FUNCTIONS--- 
*/
//- SHOW THE QUIZ QUESTION
function renderQuestion(index) {
  const q = questions[index];
  const container = document.getElementById("quizContainer");

  // Clear container
  container.innerHTML = `<h3>${q.question}</h3>`;

  // Create answer buttons
  q.answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.addEventListener("click", () => checkAnswer(index, ans));
    container.appendChild(btn);
  });
}

//- CHECK THE ANSWER
function checkAnswer(index, selected) {
  alert("Your answer was submitted");
  advanceQuestionNumber();
  advanceCheckpoint();
  nextQuestion();
 }



const words = ["POVERTY", "DHA", "BRAIN", "SYNAPSE", "DHASURV"];
let currentWord = "";
let targetWord = "";

function showQuestion() {
  renderQuestion(questionNumber-1);

  // Show question page, hide congrats page
  document.getElementById("quizContainer").style.display = "block";
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
		sendQuestionCompletion();
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
	document.getElementById("quizContainer").style.display = "none";
  if (questionNumber <= words.length) {
    document.getElementById("readyPage").style.display = "block";
    
  } else {
	  document.getElementById("congratsPage").style.display = "block";
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

/*SENDING DATA FUNCTION*/
function sendQuestionCompletion() {
  // Get values from localStorage
  const tableNumber = localStorage.getItem("tableNumber");
  const questionNumber = localStorage.getItem("questionNumber");

  // Log values before sending
  console.log("LocalStorage values → tableNumber:", tableNumber, "questionNumber:", questionNumber);

  if (!tableNumber || !questionNumber) {
    console.error("Missing tableNumber or questionNumber in localStorage!");
    return;
  }

  // Build the payload
  const data = {
    tableNumber: tableNumber,
    questionNumber: Number(questionNumber), // numeric for queries
    timestamp: new Date().toISOString(),
    type: String(questionNumber)            // string for recall
  };

  // Save to Firestore with auto-generated doc ID
  firebase.firestore()
    .collection("submissions")
    .add(data)
    .then(docRef => {
      console.log("Firestore WRITE success. DocID:", docRef.id, "Data:", data);
    })
    .catch(error => {
      console.error("Error writing to Firestore:", error);
    });
}






