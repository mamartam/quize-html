const startBtn = document.querySelector(".start-btn");
const StartBtnAudio = document.querySelector(".StartBtnAudio");
// ---------------------------------------------------------------------------
const welcomeSection = document.querySelector(".welcome-section");
const mainSection = document.querySelector(".main-section");
// ---------------------------------------------------------------------------
const questionsSection = document.querySelector(".questions-section");
const questionHeader = document.querySelector(".question-header");
const optionItems = document.querySelectorAll(".option-item");
// ---------------------------------------------------------------------------
const nextBtn = document.querySelector(".next-btn");
const finishBtn = document.querySelector(".finish-btn");
// ---------------------------------------------------------------------------
const insideBoxes = document.querySelectorAll(".inside-box");
// ---------------------------------------------------------------------------
const CorrectBtnAudio = document.querySelector(".CorrectBtnAudio");
const WrongBtnAudio = document.querySelector(".WrongBtnAudio");
// ---------------------------------------------------------------------------
const resultSection = document.querySelector(".result-section");
const userResult = document.querySelector(".user-result");

const playAgainBtn = document.querySelector(".play-again-btn");
let userRes = [];
// Start btn is appearing
setTimeout(() => {
  startBtn.classList.add("animation");
}, 1000);

// closing welcome section and showing main section
startBtn.addEventListener("click", () => {
  if (StartBtnAudio.paused) {
    StartBtnAudio.play();
  }
  welcomeSection.classList.add("pressed-start-btn");

  setTimeout(() => {
    mainSection.classList.add("active");
    welcomeSection.classList.add("hide-section");
  }, 2000);
});

let count = 0;
let userAnswers = [];

function writeDataToTheDOMElements(index, arrayOfData) {
  questionsSection.dataset.id = arrayOfData[index].id;
  questionHeader.textContent = `${index + 1}. ${arrayOfData[index].question}`;
  arrayOfData[index].answers.forEach((answer, i) => {
    optionItems[i].textContent = answer;
  });
}

async function gettingDataFromExternalSource() {
  const response = await fetch("js/data.json");
  const data = await response.json();

  writeDataToTheDOMElements(count, data);

  playAgainBtn.addEventListener("click", () => {
    userAnswers.length = 0;
    count = 0;
    writeDataToTheDOMElements(count, data);
    mainSection.classList.remove("hide-section");
    mainSection.classList.add("active");
    resultSection.classList.remove("active");
    insideBoxes.forEach((element) => {
      element.classList.remove("class-with-animation-wrong");
      element.classList.remove("class-with-animation-correct");
    });
    finishBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");
    removingOutline();
  });
  let len = data.length;
  nextBtn.addEventListener("click", () => {
    checkingAnswer(count);
    count++;
    writeDataToTheDOMElements(count, data);

    nextBtn.classList.add("hidden");
    removingOutline();
  });

  finishBtn.addEventListener("click", () => {
    checkingAnswer(count);

    setTimeout(() => {
      mainSection.classList.add("hide-section");
      mainSection.classList.remove("active");
      resultSection.classList.add("active");
      userResults(userAnswers);
    }, 1000);
  });

  questionsSection.addEventListener("click", (event) => {
    let idForArray = Number(event.currentTarget.dataset.id);
    let correctAnswer = data[idForArray].correct;
    let correctOrNot;
    if (event.target.classList.contains("option-item")) {
      let userChoice = Number(event.target.dataset.id);
      removingOutline();
      event.target.classList.add("chosen-option");

      if (userChoice === correctAnswer) {
        correctOrNot = "correct";
      } else {
        correctOrNot = "not correct";
      }
      userAnswers[idForArray] = correctOrNot;

      if (count + 1 === len) {
        finishBtn.classList.remove("hidden");
        nextBtn.classList.add("hidden");
      } else {
        nextBtn.classList.remove("hidden");
      }
    }
  });
}
gettingDataFromExternalSource();

function removingOutline() {
  optionItems.forEach((element) => {
    element.classList.remove("chosen-option");
  });
}

function checkingAnswer(idForArray) {
  if (userAnswers[idForArray] === "correct") {
    insideBoxes[idForArray].classList.add("class-with-animation-correct");
    playCorrectSound();
  } else {
    insideBoxes[idForArray].classList.add("class-with-animation-wrong");
    playWrongSound();
  }
}

function playCorrectSound() {
  WrongBtnAudio.pause();
  WrongBtnAudio.currentTime = 0;

  CorrectBtnAudio.currentTime = 0;
  CorrectBtnAudio.play();
}

function playWrongSound() {
  CorrectBtnAudio.pause();
  CorrectBtnAudio.currentTime = 0;

  WrongBtnAudio.currentTime = 0;
  WrongBtnAudio.play();
}
const UR = JSON.parse(localStorage.getItem("UserHistory")) || [];

function userResults(userAnswers) {
  let points = 0;
  userAnswers.forEach((element) => {
    if (element === "correct") points++;
  });
  userResult.textContent = points;
  let date = new Date();
  let options = {
    day: "numeric",
  };
  let curretTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.toLocaleString("en-US", options)} ${date.getHours()}:${date.getMinutes()}`;
  let result = {
    score: points,
    total: 10,
    date: curretTime,
  };
  UR.unshift(result);
  if (UR.length > 3) {
    UR.splice(3);
  }

  localStorage.setItem("UserHistory", JSON.stringify(UR));

  userRes = JSON.parse(localStorage.getItem("UserHistory"));
  console.log(userRes);
  displayingUserHistory(UR);
}
const userHistoryOfResults = document.querySelector(".user-history-of-results");
function displayingUserHistory(array) {
  userHistoryOfResults.innerHTML = "";
  let arrayForHtml = array.map((event) => {
    return `<div class="res">
            <p class="user-score">${event.score} / ${event.total}</p>
            <p class="tite-of-result">${event.date}</p>
          </div>`;
  });
  arrayForHtml = arrayForHtml.join("");
  userHistoryOfResults.innerHTML = arrayForHtml;
}
