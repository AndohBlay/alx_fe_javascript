// Quotes array
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Inspiration" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Do or do not. There is no try.", category: "Motivation" }
];

// DOM references
const quoteContainer = document.getElementById("quote-container");
const categoryFilter = document.getElementById("categoryFilter");

// ✅ Show random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteContainer.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const q = quotes[randomIndex];
  quoteContainer.textContent = `${q.text} (${q.category})`;
}

// ✅ Create add quote form
function createAddQuoteForm() {
  const form = document.getElementById("add-quote-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const textInput = document.getElementById("quoteText");
    const categoryInput = document.getElementById("quoteCategory");

    if (textInput.value.trim() === "" || categoryInput.value.trim() === "") {
      alert("Please enter both text and category");
      return;
    }

    // Add new quote
    quotes.push({
      text: textInput.value.trim(),
      category: categoryInput.value.trim()
    });

    // Update categories dynamically
    populateCategories();

    // Clear form
    textInput.value = "";
    categoryInput.value = "";
  });
}

// ✅ Populate categories dropdown dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from localStorage
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes();
  }
}

// ✅ Filter quotes based on category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;

  // Save selected category
  localStorage.setItem("selectedCategory", selectedCategory);

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  quoteContainer.innerHTML = "";

  if (filtered.length === 0) {
    quoteContainer.textContent = "No quotes in this category.";
    return;
  }

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `${q.text} (${q.category})`;
    quoteContainer.appendChild(p);
  });
}

// ✅ Event listener for filter change
categoryFilter.addEventListener("change", filterQuotes);

// ✅ Initial load
populateCategories();
filterQuotes();
createAddQuoteForm();
