// script.js

// ===== Storage & State =====
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Your limitation—it's only your imagination.", category: "Inspiration" },
  { text: "Push yourself, because no one else is going to do it for you.", category: "Motivation" },
  { text: "Dream it. Wish it. Do it.", category: "Inspiration" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===== UI: Categories & Filtering =====
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return console.error("Missing #categoryFilter");

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))].sort();
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const lastCategory = localStorage.getItem("selectedCategory") || "all";
  const exists = [...categoryFilter.options].some(o => o.value === lastCategory);
  categoryFilter.value = exists ? lastCategory : "all";
}

function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (!categoryFilter || !quoteDisplay) return console.error("Missing #categoryFilter or #quoteDisplay");

  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  quoteDisplay.innerHTML = "";
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — [${q.category}]`;
    quoteDisplay.appendChild(p);
  });
}

// ===== Add Quote =====
function addQuote(text, category) {
  const t = text.trim();
  const c = category.trim();
  if (!t || !c) return;

  quotes.push({ text: t, category: c });
  saveQuotes();
  populateCategories();
  filterQuotes();
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  if (!formContainer) return console.error("Missing #formContainer");

  formContainer.innerHTML = "";
  const form = document.createElement("form");

  const quoteInput = Object.assign(document.createElement("input"), {
    type: "text", placeholder: "Enter quote text", required: true
  });

  const categoryInput = Object.assign(document.createElement("input"), {
    type: "text", placeholder: "Enter category", required: true
  });

  const addBtn = Object.assign(document.createElement("button"), {
    type: "submit", textContent: "Add Quote"
  });

  form.append(quoteInput, categoryInput, addBtn);

  form.addEventListener("submit", e => {
    e.preventDefault();
    addQuote(quoteInput.value, categoryInput.value);
    quoteInput.value = "";
    categoryInput.value = "";
  });

  formContainer.appendChild(form);
}

// ===== Export / Import =====

// Export quotes button: #exportBtn
function exportToJsonFile() {
  // Use latest from storage if present
  const data = JSON.parse(localStorage.getItem("quotes")) || quotes;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Import file input: #importFile
function importFromJsonFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);

      // Validate: array of {text, category}
      if (!Array.isArray(parsed)) throw new Error("JSON is not an array");
      const cleaned = [];
      parsed.forEach(item => {
        if (item && typeof item.text === "string" && typeof item.category === "string") {
          const text = item.text.trim();
          const category = item.category.trim();
          if (text && category) cleaned.push({ text, category });
        }
      });
      if (cleaned.length === 0) throw new Error("No valid quotes found");

      // Merge + dedupe by text|category
      const key = q => `${q.text}|||${q.category}`;
      const map = new Map(quotes.map(q => [key(q), q]));
      let added = 0;
      cleaned.forEach(q => {
        const k = key(q);
        if (!map.has(k)) {
          map.set(k, q);
          added++;
        }
      });
      quotes = Array.from(map.values());
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert(`Import successful. Added ${added} new quote(s). Total: ${quotes.length}.`);
    } catch (err) {
      console.error(err);
      alert("Invalid JSON file. Make sure it is an array of { text, category } objects.");
    }
  };
  reader.onerror = () => alert("Failed to read file.");
  reader.readAsText(file);
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
  createAddQuoteForm();

  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) categoryFilter.addEventListener("change", filterQuotes);

  // Wire export button
  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportToJsonFile);

  // Wire import input
  const importFile = document.getElementById("importFile");
  if (importFile) {
    importFile.addEventListener("change", e => importFromJsonFile(e.target.files[0]));
  }
});
