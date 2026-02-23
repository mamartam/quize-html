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

const userHistoryOfResults = document.querySelector(".user-history-of-results");
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
const minValue = 0;

function writeDataToTheDOMElements(number, arrayOfData, index) {
  console.log(arrayOfData[index].id);
  questionsSection.dataset.id = arrayOfData[index].id;

  questionHeader.textContent = `${number + 1}. ${arrayOfData[index].question}`;
  arrayOfData[index].answers.forEach((answer, i) => {
    optionItems[i].textContent = answer;
  });
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function gettingDataFromExternalSource() {
  const response = await fetch("js/data.json");
  const dataOriginal = await response.json();

  let quantityOfQuestions =
    dataOriginal.length >= 10 ? 10 : dataOriginal.length;

  let StartMaxValue = dataOriginal.length;
  console.log(`length of data array from 0 to - ${StartMaxValue}`);
  //  Клонування масиву, щоб уникнути мутації оригінального
  let data = JSON.parse(JSON.stringify(dataOriginal));

  let randomIndex = generateRandomNumber(minValue, StartMaxValue - 1);
  writeDataToTheDOMElements(count, data, randomIndex);
  let idForArray;

  playAgainBtn.addEventListener("click", () => {
    userAnswers.length = 0;
    count = 0;
    data = JSON.parse(JSON.stringify(dataOriginal));
    let newRandomIndex = generateRandomNumber(minValue, data.length - 1);

    writeDataToTheDOMElements(count, data, newRandomIndex);
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
  // let len = data.length;
  nextBtn.addEventListener("click", () => {
    // let index = data.indexOf(data[idForArray]);
    checkingAnswer(count);
    count++;
    data.splice(randomIndex, 1);
    console.log("after splicing -", data);
    console.log(data.length);
    let newRandomIndex = generateRandomNumber(minValue, data.length - 1);

    writeDataToTheDOMElements(count, data, newRandomIndex);

    nextBtn.classList.add("hidden");
    removingOutline();
  });

  finishBtn.addEventListener("click", () => {
    checkingAnswer(count);

    setTimeout(() => {
      mainSection.classList.add("hide-section");
      mainSection.classList.remove("active");
      resultSection.classList.add("active");
      userResults(userAnswers, quantityOfQuestions);
    }, 1000);
  });

  questionsSection.addEventListener("click", (event) => {
    idForArray = Number(event.currentTarget.dataset.id);
    console.log(`options container id - ${idForArray}`);

    // let index = data.indexOf(data[idForArray]);
    let foundElement = data.find((e) => {
      return e["id"] === idForArray;
    });

    console.log(foundElement);
    let correctAnswer = foundElement.correct;
    console.log(`correctAnswer - ${correctAnswer}`);
    let correctOrNot = "";
    if (event.target.classList.contains("option-item")) {
      let userChoice = Number(event.target.dataset.id);
      console.log(`userChoice - ${userChoice}`);
      removingOutline();
      event.target.classList.add("chosen-option");

      if (userChoice === correctAnswer) {
        correctOrNot = "correct";
      } else {
        correctOrNot = "not correct";
      }
      userAnswers[count] = correctOrNot;

      if (count + 1 === quantityOfQuestions) {
        finishBtn.classList.remove("hidden");
        nextBtn.classList.add("hidden");
      } else {
        nextBtn.classList.remove("hidden");
      }
    } else {
      return;
    }
  });
}
gettingDataFromExternalSource();

function removingOutline() {
  optionItems.forEach((element) => {
    element.classList.remove("chosen-option");
  });
}

function checkingAnswer(ind) {
  if (userAnswers[ind] === "correct") {
    insideBoxes[ind].classList.add("class-with-animation-correct");
    playCorrectSound();
  } else {
    insideBoxes[ind].classList.add("class-with-animation-wrong");
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

// Функція рахує кількість коректних відповідей за поточну раунд і додає ці дані в масив з даними які були раніше
function userResults(userAnswers, qOfQ) {
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
    total: qOfQ,
    date: curretTime,
  };
  UR.unshift(result);

  if (UR.length > 3) {
    UR.splice(3);
  }

  localStorage.setItem("UserHistory", JSON.stringify(UR));

  userRes = JSON.parse(localStorage.getItem("UserHistory"));
  displayingUserHistory(UR);
}

// Виведення масиву резкльтатів користувача - останні три результати
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
