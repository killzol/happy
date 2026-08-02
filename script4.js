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

document.addEventListener("DOMContentLoaded", function () {
  var audio = document.getElementById("bgAudio");
  var toggleBtn = document.getElementById("musicToggle");
  var autoplayHint = document.getElementById("autoplayHint");

  function setPlayingUI(isPlaying) {
    toggleBtn.textContent = isPlaying ? "🔊" : "🔈";
    toggleBtn.classList.toggle("playing", isPlaying);
    autoplayHint.hidden = true;
  }

  // Пытаемся включить музыку автоматически при заходе на открытку
  var playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(function () {
        setPlayingUI(true);
      })
      .catch(function () {
        // Браузер заблокировал автозапуск со звуком — покажем подсказку
        setPlayingUI(false);
        autoplayHint.hidden = false;
      });
  }

  toggleBtn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play()
        .then(function () { setPlayingUI(true); })
        .catch(function () { /* файл ещё не добавлен пользователем */ });
    } else {
      audio.pause();
      setPlayingUI(false);
    }
  });
});
