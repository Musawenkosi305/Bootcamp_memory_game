const icons = ["A", "B", "C", "D", "E", "F", "G", "H"];
const icons2 = [...icons];
const grid = document.getElementById("grid");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restartButton");
const messageEl = document.querySelector(".message");
const gameTimerEl = document.querySelector(".gameTimer");

let checkMatchTimer = null;
let gameTimer = null;

let totalGameTime 
let cardViewSeconds = 5;

let cards = [];
let moves = 0;
let score = 0;
let flippedCards = [];

const cardValues = [];
const shuffledIcons = shuffle(cardValues.concat(icons, icons2));

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

restartButton.addEventListener("click", restartGame);

function restartGame() {
  let msg = `Wanna start game?`;
  if (cards.length > 0) {
    msg = `Progress will be lost, wanna continue?`;
  }
  const res = window.confirm(msg);
  if (res) {
    startGame();
  }
}

function startGame() {
  clearGame();
  createCards();
  moves = 0;
  score = 0;
  scoreElement.style.display = "block";
  scoreElement.textContent = "Moves: 0";
  flippedCards = [];

  cards.forEach((card) => {
    card.classList.remove("flipped");
    card.classList.remove("matched");
  });

  shuffleCards();
  showPreviewTimer();
}

function createCards() {
  for (let i = 0; i < shuffledIcons.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = shuffledIcons[i];
    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
    cards.push(card);
  }
}

function shuffleCards() {
  const shuffledCards = shuffle(cards);
  shuffledCards.forEach((card) => grid.appendChild(card));
}

function showPreviewTimer() {
  let timeToShowTheCard = cardViewSeconds;
  const timeMessageEl = messageEl.querySelector("span.time");
  messageEl.style.display = "block";
  const timerInterval = setInterval(() => {
    timeMessageEl.innerHTML = timeToShowTheCard;
    timeToShowTheCard--;
    if (timeToShowTheCard < 0) {
      hideAllCards();
      clearInterval(timerInterval);
      messageEl.style.display = "none";
    }
  }, 1000);
}

function hideAllCards() {
  cards.forEach((card) => {
    card.classList.add("flipped");
  });
//   
}


function clearGame() {
  scoreElement.style.display = "none";
  messageEl.style.display = "none";
  gameTimerEl.style.display = "none";
  grid.innerHTML = "";
  cards = [];
  flippedCards = [];
  clearInterval(gameTimer);
  clearInterval(checkMatchTimer);
}

function flipCard(card) {
  if (card.classList.contains("flipped") && flippedCards.length < 2) {
    card.classList.remove("flipped");
    flippedCards.push(card);
    if (flippedCards.length === 2) {
      checkMatchTimer = setTimeout(checkMatch, 1000);
    }
  }
}

function checkMatch() {
  moves++;
  scoreElement.textContent = `moves: ${moves}`;
  if (flippedCards[0].textContent === flippedCards[1].textContent) {
    flippedCards[0].classList.add("matched");
    flippedCards[1].classList.add("matched");
    score++;
    if (score === shuffledIcons.length / 2) {
      setTimeout(showFinalScore, 500);
    }
  } else {
    flippedCards.forEach((card) => card.classList.add("flipped"));
  }
  flippedCards = [];
}

function showFinalScore() {
  const res = window.confirm(
    `Congrats, you finished the game in ${moves} moves. Wanna play again?`
  );
  clearGame();
  if (res) {
    startGame();
  }
}
