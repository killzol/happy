// ===== Защита: без правильного пароля сюда попадать не должны =====
(function guard() {
  var ok = false;
  try {
    ok = localStorage.getItem("unlocked") === "true";
  } catch (err) {
    ok = true;
  }
  if (!ok) {
    window.location.href = "index.html";
  }
})();

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

function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

document.addEventListener("DOMContentLoaded", function () {
  var steps = document.querySelectorAll(".step");
  var dots = document.querySelectorAll(".dot");

  function goToStep(n) {
    steps.forEach(function (s) {
      s.hidden = s.getAttribute("data-step") !== String(n);
    });
    dots.forEach(function (d) {
      var dn = parseInt(d.getAttribute("data-dot"), 10);
      d.classList.remove("active", "done");
      if (dn === n) d.classList.add("active");
      else if (dn < n) d.classList.add("done");
    });
  }

  // ================= ШАГ 1: "Ты любишь меня?" =================
  var yesBtn = document.getElementById("yesBtn");
  var noBtn = document.getElementById("noBtn");
  var teaseText = document.getElementById("teaseText");
  var step1Buttons = document.getElementById("step1Buttons");

  var teasePhrases = [
    "Уверена? 🥺",
    "Точно-точно?",
    "Подумай ещё разок...",
    "Нееет, только не так!",
    "Ну пожалуйста 🙏",
    "Кнопка 'нет' уже устала бегать 😅"
  ];
  var shuffledTease = shuffleArray(teasePhrases);
  var teasePointer = 0;
  function nextTeasePhrase() {
    if (teasePointer >= shuffledTease.length) {
      shuffledTease = shuffleArray(teasePhrases);
      teasePointer = 0;
    }
    return shuffledTease[teasePointer++];
  }

  var noClickCount = 0;

  noBtn.addEventListener("click", function () {
    noClickCount++;

    // "Нет" уменьшается и убегает
    var noScale = Math.max(0.3, 1 - noClickCount * 0.13);
    // "Да" растёт с каждым отказом
    var yesScale = Math.min(2, 1 + noClickCount * 0.18);
    yesBtn.style.transform = "scale(" + yesScale.toFixed(2) + ")";

    var containerRect = step1Buttons.getBoundingClientRect();
    var btnRect = noBtn.getBoundingClientRect();

    if (!noBtn.classList.contains("fleeing")) {
      noBtn.classList.add("fleeing");
    }

    var maxLeft = Math.max(0, containerRect.width - btnRect.width);
    var maxTop = Math.max(0, containerRect.height - btnRect.height);
    var randomLeft = Math.random() * maxLeft;
    var randomTop = Math.random() * maxTop;

    noBtn.style.left = randomLeft + "px";
    noBtn.style.top = randomTop + "px";
    noBtn.style.transform = "scale(" + noScale.toFixed(2) + ")";

    teaseText.textContent = nextTeasePhrase();

    // Если "нет" стала совсем крошечной — дальше не уменьшаем, но всё ещё убегает
  });

  yesBtn.addEventListener("click", function () {
    goToStep(2);
  });

  // ================= ШАГ 2: "У кого сегодня праздник?" =================
  var step2Buttons = document.querySelectorAll('.step[data-step="2"] .option-btn');
  step2Buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.classList.add("correct-flash");
      setTimeout(function () {
        goToStep(3);
      }, 450);
    });
  });

  // ================= ШАГ 3: "Как я тебя чаще всего называю?" =================
  var nicknameMsg = document.getElementById("nicknameMsg");
  var nicknameButtons = document.querySelectorAll("#nicknameButtons .option-btn");

  var wrongNicknameMessages = [
    "Почти, но нет 😅",
    "Не угадала... попробуй ещё",
    "Мимо! Есть вариант получше",
    "Неа, но мне нравится ход мыслей 😏"
  ];
  var shuffledWrong = shuffleArray(wrongNicknameMessages);
  var wrongPointer = 0;
  function nextWrongMessage() {
    if (wrongPointer >= shuffledWrong.length) {
      shuffledWrong = shuffleArray(wrongNicknameMessages);
      wrongPointer = 0;
    }
    return shuffledWrong[wrongPointer++];
  }

  nicknameButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isCorrect = btn.getAttribute("data-correct") === "true";

      nicknameButtons.forEach(function (b) {
        b.classList.remove("correct-flash", "wrong-flash");
      });

      if (isCorrect) {
        btn.classList.add("correct-flash");
        nicknameMsg.textContent = "Точно! Кисуня 🥰";
        nicknameButtons.forEach(function (b) { b.disabled = true; });
        setTimeout(function () {
          window.location.href = "intro.html";
        }, 900);
      } else {
        btn.classList.add("wrong-flash");
        nicknameMsg.textContent = nextWrongMessage();
        setTimeout(function () {
          btn.classList.remove("wrong-flash");
        }, 450);
      }
    });
  });

  goToStep(1);
});
