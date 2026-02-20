const startBtn = document.querySelector(".start-btn");
const welcomeSection = document.querySelector(".welcome-section");
const mainSection = document.querySelector(".main-section");
const questionHeader = document.querySelector(".question-header");
const optionItems = document.querySelectorAll(".option-item");
const nextBtn = document.querySelector(".next-btn");
const activeNextBtn = document.querySelector(".active-next-btn");
const insideBoxes = document.querySelectorAll(".inside-box");
const questionsSection = document.querySelector(".questions-section");
const finishBtn = document.querySelector(".finish-btn");
const resultSection = document.querySelector(".result-section");
const userResult = document.querySelector(".user-result");

let count = 0;
let userAnswers = [];

// Start btn is appearing
setTimeout(() => {
  startBtn.classList.add("animation");
}, 1000);

// closing welcome section and showing main section
startBtn.addEventListener("click", () => {
  welcomeSection.classList.add("pressed-start-btn");

  setTimeout(() => {
    mainSection.classList.add("active");
    welcomeSection.classList.add("hide-section");
  }, 2000);
});

async function gettingDataFromExternalSource() {
  const response = await fetch("js/data.json");
  const data = await response.json();
  console.log(data);
  writeDataToTheDOMElements(count, data);

  questionsSection.addEventListener("click", (event) => {
    let correctOrNot;
    let idForArray = Number(questionsSection.dataset.id);
    let correctAnswer = data[idForArray].correct;

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
    }
    btnNext(idForArray, data);
  });
}
gettingDataFromExternalSource();

// displaying question and answers
function writeDataToTheDOMElements(number, arrayOfData) {
  questionsSection.dataset.id = arrayOfData[number].id;
  questionHeader.textContent = `${number + 1}. ${arrayOfData[number].question}`;
  for (i in arrayOfData[number].answers) {
    optionItems[i].textContent = arrayOfData[number].answers[i];
  }
}
// next btn fynction
function btnNext(idForArray, arrayOfData) {
  let len = arrayOfData.length;
  if (idForArray + 1 < len) {
    nextBtn.classList.remove("hidden");
  }
  if (idForArray + 1 === len) {
    finishBtn.classList.remove("hidden");
    finishDtn(idForArray, arrayOfData);
  }

  nextBtn.addEventListener("click", () => {
    let index = idForArray + 1;
    removingOutline();
    writeDataToTheDOMElements(index, arrayOfData);
    nextBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");
    checkingAnswer(idForArray);
  });
}
// finish btn function
function finishDtn(idForArray, arrayOfData) {
  finishBtn.addEventListener("click", () => {
    writeDataToTheDOMElements(idForArray, arrayOfData);
    checkingAnswer(idForArray);

    setTimeout(() => {
      mainSection.classList.add("hide-section");
      mainSection.classList.remove("active");
      resultSection.classList.add("active");
      userResults(userAnswers);
    }, 1000);
  });
}
// function which checks if answer is correct and if so colors the nav box in appropriate color
function checkingAnswer(idForArray) {
  if (userAnswers[idForArray] === "correct") {
    insideBoxes[idForArray].classList.add("class-with-animation-correct");
  } else {
    insideBoxes[idForArray].classList.add("class-with-animation-wrong");
  }
}
// calculate points and display them on the screen
function userResults(userAnswers) {
  let points = 0;
  userAnswers.forEach((element) => {
    if (element === "correct") points++;
  });
  userResult.textContent = points;
}

function removingOutline() {
  optionItems.forEach((element) => {
    element.classList.remove("chosen-option");
  });
}
