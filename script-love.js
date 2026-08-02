// ===== Защита доступа =====
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

// ===== Летящие лепестки на фоне =====
function createPetals() {
  var container = document.getElementById("petalsBg");
  if (!container) return;
  var symbols = ["🌸", "💮", "❀"];
  var count = 12;
  for (var i = 0; i < count; i++) {
    var petal = document.createElement("div");
    petal.className = "petal-fall";
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = Math.random() * 100 + "%";
    var duration = 9 + Math.random() * 8;
    var delay = Math.random() * 10;
    petal.style.animationDuration = duration + "s";
    petal.style.animationDelay = delay + "s";
    petal.style.fontSize = (14 + Math.random() * 14) + "px";
    container.appendChild(petal);
  }
}
createPetals();

// ===== Текст можно менять здесь =====
var LOVE_TEXT =
  "Каждая дата в той галерее —\nэто ты рядом со мной.\n\n" +
  "И где бы мы ни были,\nглавное — что мы вместе.\n\n" +
  "Спасибо, что ты есть. 💗";

document.addEventListener("DOMContentLoaded", function () {
  var typewriter = document.getElementById("typewriter");
  var continueBtn = document.getElementById("continueBtn");

  typewriter.innerHTML = '<span class="typed-text"></span><span class="cursor">&nbsp;</span>';
  var typedEl = typewriter.querySelector(".typed-text");

  var i = 0;
  var speed = 45;

  function typeNext() {
    if (i < LOVE_TEXT.length) {
      typedEl.textContent += LOVE_TEXT.charAt(i);
      i++;
      setTimeout(typeNext, speed);
    } else {
      continueBtn.hidden = false;
    }
  }
  setTimeout(typeNext, 400);

  continueBtn.addEventListener("click", function () {
    window.location.href = "postcard.html";
  });
});
