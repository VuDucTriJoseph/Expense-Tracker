// Get elements by ID
const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expensesAmountEl = document.getElementById("expenses-amount");
const transactionListEl = document.getElementById("transaction-list");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const transactionFormEl = document.getElementById("transaction-form");

// Initialize transactions from localStorage or as an empty array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// trasaction form submit event
transactionFormEl.addEventListener("submit", addTransaction);

// Function to add a new transaction
function addTransaction(e) {
  e.preventDefault();

  // get form values
  const decription = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  transactions.push({
    id: Date.now(),
    decription,
    amount,
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();

  updateSummary();

  transactionFormEl.reset();
}

// Function to update the transaction list in the DOM
function updateTransactionList() {
  transactionListEl.innerHTML = "";

  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");
  li.innerHTML = `
    <span>${transaction.decription}</span>
    <span>${formatCurrency(transaction.amount)}
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button></span>
  `;
  return li;
}

function updateSummary() {
  const balance = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0,
  );
  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expensesAmountEl.textContent = formatCurrency(Math.abs(expenses));

//   console.log("Balance:", balance);
//   console.log("Income:", income);
//   console.log("Expenses:", expenses);
}

function formatCurrency(number) {
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTransactionList();
  updateSummary();
}

// initial render
updateTransactionList();
updateSummary();
