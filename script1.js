// ===== Настройки =====
var CORRECT_PASSWORD = "13.07.2025";
var MAX_ATTEMPTS = 5;

var FAIL_MESSAGES = [
  "Ай-ай-ай, мимо! Попробуй ещё раз 💔",
  "Не угадал(а)... но ты уже близко!",
  "Хм, это не та дата 🤔",
  "Упс! Подумай ещё чуть-чуть 😅",
  "Почти, но нет 🙈",
  "Неа, попробуй вспомнить получше 🧐"
];

// ===== Плавающие сердечки на фоне =====
function createFloatingHearts() {
  var container = document.getElementById("heartsBg");
  if (!container) return;
  var count = 14;
  for (var i = 0; i < count; i++) {
    var heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = "❤";
    heart.style.left = Math.random() * 100 + "%";
    var duration = 8 + Math.random() * 10;
    var delay = Math.random() * 10;
    heart.style.animationDuration = duration + "s";
    heart.style.animationDelay = delay + "s";
    heart.style.fontSize = (14 + Math.random() * 18) + "px";
    container.appendChild(heart);
  }
}
createFloatingHearts();

// ===== Перемешивание сообщений об ошибке (без повторов) =====
function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

var shuffledMessages = shuffleArray(FAIL_MESSAGES);
var messagePointer = 0;

function nextFailMessage() {
  if (messagePointer >= shuffledMessages.length) {
    // на всякий случай перемешаем заново, если попыток вдруг больше сообщений
    shuffledMessages = shuffleArray(FAIL_MESSAGES);
    messagePointer = 0;
  }
  var msg = shuffledMessages[messagePointer];
  messagePointer++;
  return msg;
}

// ===== Маска ввода даты дд.мм.гггг =====
function formatDateInput(value) {
  var digits = value.replace(/\D/g, "").slice(0, 8);
  var day = digits.slice(0, 2);
  var month = digits.slice(2, 4);
  var year = digits.slice(4, 8);
  var result = day;
  if (month.length > 0) result += "." + month;
  if (year.length > 0) result += "." + year;
  return result;
}

// ===== Основная логика =====
var attemptsLeft = MAX_ATTEMPTS;

document.addEventListener("DOMContentLoaded", function () {
  var input = document.getElementById("passInput");
  var form = document.getElementById("passForm");
  var submitBtn = document.getElementById("submitBtn");
  var messageEl = document.getElementById("message");
  var attemptsEl = document.getElementById("attemptsLeftText");

  input.addEventListener("input", function (e) {
    var caretWasAtEnd = e.target.selectionEnd === e.target.value.length;
    e.target.value = formatDateInput(e.target.value);
    if (caretWasAtEnd) {
      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (attemptsLeft <= 0) return;

    var value = input.value.trim();

    if (value === CORRECT_PASSWORD) {
      messageEl.textContent = "Верно! Открываю... 💫";
      messageEl.style.color = "#c8ffd4";
      submitBtn.disabled = true;
      input.disabled = true;
      try {
        localStorage.setItem("unlocked", "true");
      } catch (err) {
        // localStorage может быть недоступен — не критично
      }
      setTimeout(function () {
        window.location.href = "quiz.html";
      }, 700);
      return;
    }

    attemptsLeft--;
    messageEl.textContent = nextFailMessage();
    messageEl.style.color = "#ffd9e2";

    input.classList.remove("shake");
    // форсируем перезапуск анимации
    void input.offsetWidth;
    input.classList.add("shake");

    if (attemptsLeft > 0) {
      attemptsEl.textContent = "Осталось попыток: " + attemptsLeft;
    } else {
      attemptsEl.textContent = "Попытки закончились 🥀";
      messageEl.textContent = "Больше нет попыток... подумай хорошенько и обнови страницу.";
      input.disabled = true;
      submitBtn.disabled = true;
    }
  });
});
