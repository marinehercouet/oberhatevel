const editor = document.getElementById("editor");
const mediaFilter = document.getElementById("mediaFilter");
const yearFilter = document.getElementById("yearFilter");

/* Subtle typography variation */
const fonts = [
  "system-ui",
  "Georgia, serif",
  "Inter, system-ui",
  "Helvetica Neue, sans-serif"
];

const sizes = ["0.95em", "1em", "1.05em"];
const weights = ["400", "450", "500"];

/* Media types + icons */
const mediaTypes = {
  movie: "🎬",
  book: "📚",
  podcast: "🎧",
  album: "💿",
  exhibition: "🖼"
};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

/* Create entry on Enter */
editor.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const text = editor.innerText.trim();
    editor.innerHTML = "";
    if (!text) return;

    const [rawType, ...rest] = text.split(":");
    const type = rawType.toLowerCase();
    const contentText = rest.length ? rest.join(":").trim() : text;

    const entry = document.createElement("div");
    entry.className = "entry";
    entry.dataset.type = mediaTypes[type] ? type : "unknown";
    entry.dataset.year = today().slice(0, 4);

    entry.style.fontFamily = random(fonts);
    entry.style.fontSize = random(sizes);
    entry.style.fontWeight = random(weights);

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = mediaTypes[type] || "•";

    const content = document.createElement("span");
    content.className = "content";
    content.textContent = contentText;

    const date = document.createElement("span");
    date.className = "date";
    date.textContent = today();

    entry.appendChild(icon);
    entry.appendChild(content);
    entry.appendChild(date);

    editor.appendChild(entry);

    updateYearOptions();
    applyFilters();
    placeCaretAtEnd(editor);
  }
});

/* Update year filter dynamically */
function updateYearOptions() {
  const years = new Set(
    [...document.querySelectorAll(".entry")].map(e => e.dataset.year)
  );

  yearFilter.innerHTML = `<option value="all">All years</option>`;

  [...years].sort((a, b) => b - a).forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  });
}

/* Apply media + year filters */
function applyFilters() {
  const mediaValue = mediaFilter.value;
  const yearValue = yearFilter.value;

  document.querySelectorAll(".entry").forEach(entry => {
    const matchesMedia =
      mediaValue === "all" || entry.dataset.type === mediaValue;

    const matchesYear =
      yearValue === "all" || entry.dataset.year === yearValue;

    entry.style.display = matchesMedia && matchesYear ? "flex" : "none";
  });
}

mediaFilter.addEventListener("change", applyFilters);
yearFilter.addEventListener("change", applyFilters);

/* Caret helper */
function placeCaretAtEnd(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

