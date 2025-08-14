// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Your limitation—it's only your imagination.", category: "Inspiration" },
  { text: "Push yourself, because no one else is going to do it for you.", category: "Motivation" },
  { text: "Dream it. Wish it. Do it.", category: "Inspiration" }
];

// Populate category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return console.error("Missing #categoryFilter in HTML");

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore previous category
  const lastCategory = localStorage.getItem("selectedCategory");
  if (lastCategory && [...categoryFilter.options].some(opt => opt.value === lastCategory)) {
    categoryFilter.value = lastCategory;
  }
}

// Filter and display quotes
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (!categoryFilter || !quoteDisplay) {
    return console.error("Missing #categoryFilter or #quoteDisplay in HTML");
  }

  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  quoteDisplay.innerHTML = "";

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  filteredQuotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — [${q.category}]`;
    quoteDisplay.appendChild(p);
  });
}

// Add a new quote
function addQuote(text, category) {
  quotes.push({ text, category });
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  filterQuotes();
}

// Create Add Quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  if (!formContainer) return console.error("Missing #formContainer in HTML");

  formContainer.innerHTML = "";

  const form = document.createElement("form");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter quote text";
  quoteInput.required = true;

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";
  categoryInput.required = true;

  const addBtn = document.createElement("button");
  addBtn.type = "submit";
  addBtn.textContent = "Add Quote";

  form.append(quoteInput, categoryInput, addBtn);

  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();
    if (!text || !category) {
      alert("Both fields required!");
      return;
    }
    addQuote(text, category);
    quoteInput.value = "";
    categoryInput.value = "";
  });

  formContainer.appendChild(form);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
  createAddQuoteForm();

  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterQuotes);
  }
});
