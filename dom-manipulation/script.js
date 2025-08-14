// script.js

let quotes = [
  {
    text: "The best way to get started is to quit talking and begin doing.",
    category: "Motivation",
  },
  {
    text: "Your limitation—it's only your imagination.",
    category: "Inspiration",
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    category: "Motivation",
  },
  { text: "Dream it. Wish it. Do it.", category: "Inspiration" },
];

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[randomIndex];
  quoteDisplay.textContent = `"${text}" — [${category}]`;
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
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

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addBtn);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const newQuote = {
      text: quoteInput.value.trim(),
      category: categoryInput.value.trim(),
    };
    if (!newQuote.text || !newQuote.category) return;
    quotes.push(newQuote);
    quoteInput.value = "";
    categoryInput.value = "";
  });

  formContainer.appendChild(form);
}
