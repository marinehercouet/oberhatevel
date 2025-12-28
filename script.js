const editor = document.getElementById("editor");
const entriesContainer = document.getElementById("entries");
const mediaFilter = document.getElementById("mediaFilter");
const yearFilter = document.getElementById("yearFilter");

const STORAGE_KEY = "mediaLogEntries";

/* Typography variation */
const fonts = ["system-ui", "Georgia, serif", "Inter, system-ui", "Helvetica Neue, sans-serif"];
const sizes = ["0.95em", "1em", "1.05em"];
const weights = ["400", "450", "500"];

/* Media icons */
const mediaTypes = { movie: "🎬", book: "📚", podcast: "🎧", album: "💿", exhibition: "🖼" };

function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function today() { return new Date().toISOString().slice(0, 10); }

/* ---------- STORAGE ---------- */

function saveEntries() {
  const entries = [...entriesContainer.querySelectorAll(".entry")].map(entry => ({
    type: entry.dataset.type,
    year: entry.dataset.year,
    icon: entry.querySelector(".icon").textContent,
    content: entry.querySelector(".content").innerHTML,
    date: entry.querySelector(".date").textContent,
    style: {
      fontFamily: entry.style.fontFamily,
      fontSize: entry.style.fontSize,
      fontWeight: entry.style.fontWeight
    }
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function loadEntries() {
  entriesContainer.innerHTML = ""; // clear container to avoid duplication
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  const entries = JSON.parse(saved);
  entries.forEach(data => {
    createEntry(data.type, data.content, data.style, data.date, data.icon, data.year);
  });

  updateYearOptions();
}

/* ---------- ENTRY CREATION ---------- */

function createEntry(type, contentText, style = {}, dateText = null, iconText = null, yearText = null) {
  const entry = document.createElement("div");
  entry.className = "entry";

  entry.dataset.type = type || "unknown";
  const todayDate = today();
  entry.dataset.year = yearText || (dateText ? dateText.slice(0, 4) : todayDate.slice(0, 4));
  const finalDate = dateText || todayDate;

  entry.style.fontFamily = style.fontFamily || random(fonts);
  entry.style.fontSize = style.fontSize || random(sizes);
  entry.style.fontWeight = style.fontWeight || random(weights);

  const icon = document.createElement("span");
  icon.className = "icon";
  icon.textContent = iconText || mediaTypes[type] || "•";

  const content = document.createElement("span");
  content.className = "content";
  content.innerHTML = contentText;

  const date = document.createElement("span");
  date.className = "date";
  date.textContent = finalDate;

  const deleteBtn = document.createElement("span");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "🗑";
  deleteBtn.title = "Delete this entry";
  deleteBtn.addEventListener("click", () => {
    entry.remove();
    saveEntries();
    updateYearOptions();
  });

  entry.appendChild(icon);
  entry.appendChild(content);
  entry.appendChild(date);
  entry.appendChild(deleteBtn);

  entriesContainer.appendChild(entry);
}

/* ---------- HANDLE ENTER ---------- */

editor.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const text = editor.innerText.trim();
    if (!text) return;

    const [rawType, ...rest] = text.split(":");
    const type = rawType.toLowerCase();
    const contentText = rest.length ? rest.join(":").trim() : text;

    createEntry(type, contentText);
    editor.innerHTML = ""; // clear input after creating entry

    updateYearOptions();
    applyFilters();
    saveEntries();
    placeCaretAtEnd(editor);
  }
});

/* ---------- FILTERING ---------- */

function updateYearOptions() {
  const years = new Set([...entriesContainer.querySelectorAll(".entry")].map(e => e.dataset.year));
  yearFilter.innerHTML = `<option value="all">All years</option>`;
  [...years].sort((a, b) => b - a).forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  });
}

function applyFilters() {
  const mediaValue = mediaFilter.value;
  const yearValue = yearFilter.value;
  entriesContainer.querySelectorAll(".entry").forEach(entry => {
    const matchesMedia = mediaValue === "all" || entry.dataset.type === mediaValue;
    const matchesYear = yearValue === "all" || entry.dataset.year === yearValue;
    entry.style.display = matchesMedia && matchesYear ? "flex" : "none";
  });
}

mediaFilter.addEventListener("change", applyFilters);
yearFilter.addEventListener("change", applyFilters);

/* ---------- CARET ---------- */

function placeCaretAtEnd(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

/* ---------- INIT ---------- */

loadEntries();


/* ---------- INIT ---------- */

loadEntries();

