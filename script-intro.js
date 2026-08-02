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

document.addEventListener("DOMContentLoaded", function () {
  var goBtn = document.getElementById("goBtn");
  goBtn.addEventListener("click", function () {
    window.location.href = "gallery.html";
  });
});
