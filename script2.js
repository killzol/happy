// ===== Защита: без правильного пароля сюда попадать не должны =====
(function guard() {
  var ok = false;
  try {
    ok = localStorage.getItem("unlocked") === "true";
  } catch (err) {
    ok = true; // если localStorage недоступен — не блокируем
  }
  if (!ok) {
    window.location.href = "index.html";
  }
})();

// =====================================================================
// ДАННЫЕ О ФОТО/ВИДЕО
// Чтобы вставить свою картинку — добавь поле src: "путь.jpg"
// Чтобы вставить видео — поставь type:"video" и поле src: "путь.mp4"
// У одной карточки может быть несколько дат: dates:["12.02.2023","14.02.2023"]
// =====================================================================
var PHOTOS = [
  { id: 1,  dates: ["27.10.2025"], type: "image", src: "1.jpg"},
  { id: 2,  dates: ["03.11.2025"], type: "image", src: "2.jpg" },
  { id: 3,  dates: ["11.02.2026"], type: "image", src: "3.jpg" },
  { id: 4,  dates: ["08.08.2025"], type: "image", src: "4.jpg" },
  { id: 5,  dates: ["01.05.2023"], type: "image", src: "5.jpg" },
  { id: 6,  dates: ["17.07.2025"], type: "image", src: "6.jpg" },
  { id: 7,  dates: ["06.06.2026"], type: "image", src: "7.jpg" },
  { id: 8,  dates: ["08.03.2026"], type: "image", src: "8.jpg" },
  { id: 9,  dates: ["30.08.2023"], type: "image", src: "9.jpg" },
  { id: 10, dates: ["15.06.2026"], type: "image", src: "10.jpg" },
  { id: 11, dates: ["06.12.2025"], type: "image", src: "11.jpg" },
  { id: 12, dates: ["12.12.2025"], type: "image", src: "12.jpg" },
  { id: 13, dates: ["07.07.2026"], type: "image", src: "13.jpg" },
  { id: 14, dates: ["13.11.2025"], type: "image", src: "14.jpg" },
  { id: 15, dates: ["07.04.2026"], type: "image", src: "15.jpg" },
  { id: 16, dates: ["09.04.2026"], type: "image", src: "16.jpg" },
  { id: 17, dates: ["21.07.2026"], type: "image", src: "17.jpg" },
  { id: 18, dates: ["05.10.2025"], type: "image", src: "18.jpg" },
  { id: 19, dates: ["13.01.2026"], type: "image", src: "19.jpg" },
  { id: 20, dates: ["15.01.2026"], type: "image", src: "20.jpg" },
  { id: 21, dates: ["12.10.2025"], type: "image", src: "21.jpg" },
  { id: 22, dates: ["19.06.2023"], type: "image", src: "22.jpg" },
  { id: 23, dates: ["30.04.2026"], type: "image", src: "23.jpg" },
  { id: 24, dates: ["07.11.2025"], type: "image", src: "24.jpg" },
  { id: 25, dates: ["18.10.2025"], type: "image", src: "25.jpg" },
  { id: 26, dates: ["01.05.2026"], type: "image", src: "26.jpg" },
  { id: 27, dates: ["03.05.2026"], type: "video", src: "27.mp4" },
  { id: 28, dates: ["07.02.2026"], type: "video", src: "28.mp4" },
  { id: 29, dates: ["03.10.2025"], type: "image", src: "29.jpg" },
  { id: 30, dates: ["06.09.2025"], type: "image", src: "30.jpg" }
];

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

function dateToSortValue(dateStr) {
  var parts = dateStr.split(".");
  if (parts.length !== 3) return 0;
  return parseInt(parts[2] + parts[1] + parts[0], 10) || 0;
}

function randRange(min, max) {
  return min + Math.random() * (max - min);
}

// ---- Определяем правильный MIME-тип видео по расширению файла ----
function videoMimeType(src) {
  var ext = (src.split(".").pop() || "").toLowerCase();
  if (ext === "mov") return "video/quicktime";
  if (ext === "webm") return "video/webm";
  return "video/mp4";
}

// ---- Строим содержимое одной карточки фото (картинка/видео/чёрный плейсхолдер) ----
// interactive=true — карточка в результатах поиска: показываем реальные
// элементы управления и звук, чтобы видео можно было посмотреть.
// interactive=false — декоративный фон: видео просто беззвучно и без
// управления (пользователь всё равно не может по нему кликнуть).
function buildMediaInner(photo, interactive) {
  if (photo.type === "video") {
    if (photo.src) {
      var mime = videoMimeType(photo.src);
      if (interactive) {
        return '<video controls playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover;">' +
          '<source src="' + photo.src + '" type="' + mime + '"></video>';
      }
      return '<video muted loop playsinline style="width:100%;height:100%;object-fit:cover;">' +
        '<source src="' + photo.src + '" type="' + mime + '"></video>' +
        '<span class="play-icon">&#9654;</span>';
    }
    return '<span class="play-icon">&#9654;</span>';
  }
  if (photo.src) {
    return '<img src="' + photo.src + '" alt="" style="width:100%;height:100%;object-fit:cover;">';
  }
  return "";
}

document.addEventListener("DOMContentLoaded", function () {
  var bgCollage = document.getElementById("bgCollage");
  var searchInput = document.getElementById("searchInput");
  var clearBtn = document.getElementById("clearSearch");
  var hintText = document.getElementById("hintText");
  var noResults = document.getElementById("noResults");
  var resultsArea = document.getElementById("resultsArea");
  var refToggle = document.getElementById("refToggle");
  var refPanel = document.getElementById("refPanel");
  var refClose = document.getElementById("refClose");
  var refList = document.getElementById("refList");
  var heartBtn = document.getElementById("heartBtn");

  // ================= Размытый "живой" фон из фото =================
  function buildBackgroundCollage() {
    var poolSize = 25;
    for (var i = 0; i < poolSize; i++) {
      var photo = PHOTOS[i % PHOTOS.length];
      var el = document.createElement("div");
      el.className = "bg-photo";

      var size = randRange(100, 250);
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.left = randRange(-5, 95) + "%";
      el.style.top = randRange(-5, 95) + "%";
      el.style.setProperty("--blur", randRange(3, 7).toFixed(1) + "px");
      el.style.setProperty("--op", randRange(0.18, 0.4).toFixed(2));
      el.style.setProperty("--dx", randRange(-30, 30).toFixed(0) + "px");
      el.style.setProperty("--dy", randRange(-30, 30).toFixed(0) + "px");
      el.style.setProperty("--dur", randRange(14, 26).toFixed(1) + "s");
      el.style.animationDelay = "-" + randRange(0, 20).toFixed(1) + "s";

      el.innerHTML = buildMediaInner(photo);
      bgCollage.appendChild(el);
    }
  }
  buildBackgroundCollage();

  // ================= Справочник дат =================
  var allDates = [];
  PHOTOS.forEach(function (photo) {
    photo.dates.forEach(function (d) {
      if (allDates.indexOf(d) === -1) allDates.push(d);
    });
  });
  allDates.sort(function (a, b) { return dateToSortValue(a) - dateToSortValue(b); });

  allDates.forEach(function (date) {
    var chip = document.createElement("button");
    chip.className = "ref-chip";
    chip.type = "button";
    chip.textContent = date;
    chip.addEventListener("click", function () {
      searchInput.value = date;
      runSearch(date);
      highlightChip(chip);
      refPanel.classList.remove("open");
    });
    refList.appendChild(chip);
  });

  function highlightChip(activeChip) {
    var chips = refList.querySelectorAll(".ref-chip");
    chips.forEach(function (c) { c.classList.toggle("active", c === activeChip); });
  }

  // ================= Поиск и "всплытие" фото =================
  function renderResultCard(photo, index) {
    var card = document.createElement("div");
    card.className = "reveal-photo" + (photo.type === "video" ? " reveal-video" : "");
    card.style.animationDelay = (index * 90) + "ms";
    card.innerHTML = buildMediaInner(photo, true) +
      '<span class="photo-label">' + photo.dates.join(", ") + "</span>";
    return card;
  }

  function runSearch(rawValue) {
    var query = rawValue.trim();
    resultsArea.innerHTML = "";

    if (query === "") {
      hintText.hidden = false;
      noResults.hidden = true;
      return;
    }

    var matches = PHOTOS.filter(function (photo) {
      return photo.dates.some(function (d) { return d.indexOf(query) !== -1; });
    });

    if (matches.length === 0) {
      hintText.hidden = true;
      noResults.hidden = false;
      return;
    }

    hintText.hidden = true;
    noResults.hidden = true;

    matches.forEach(function (photo, i) {
      resultsArea.appendChild(renderResultCard(photo, i));
    });
  }

  searchInput.addEventListener("input", function (e) {
    e.target.value = formatDateInput(e.target.value);
    runSearch(e.target.value);
    highlightChip(null);
  });

  clearBtn.addEventListener("click", function () {
    searchInput.value = "";
    runSearch("");
    highlightChip(null);
    searchInput.focus();
  });

  // ================= Справочник: открытие/закрытие =================
  refToggle.addEventListener("click", function () {
    refPanel.classList.toggle("open");
  });
  refClose.addEventListener("click", function () {
    refPanel.classList.remove("open");
  });
  document.addEventListener("click", function (e) {
    var isInsidePanel = refPanel.contains(e.target);
    var isToggle = refToggle.contains(e.target);
    if (!isInsidePanel && !isToggle) {
      refPanel.classList.remove("open");
    }
  });

  // ================= Сердечко ведёт дальше =================
  heartBtn.addEventListener("click", function () {
    heartBtn.disabled = true;
    setTimeout(function () {
      window.location.href = "love.html";
    }, 350);
  });
});
