// ==========================================
// STUDENT EXPENSE TRACKER
// ==========================================


// ==========================================
// LOAD EXPENSES FROM LOCAL STORAGE
// ==========================================

let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];


// Current expenses being displayed

let displayedExpenses = [...expenses];


// Chart variable

let expenseChart = null;


// ==========================================
// DISPLAY EXPENSES
// ==========================================

function displayExpenses() {

    let table =
        document.getElementById("expenseTable");


    // Clear table

    table.innerHTML = "";


    // Starting values

    let total = 0;

    let highest = 0;


    // ==========================================
    // DISPLAY EACH EXPENSE
    // ==========================================

    displayedExpenses.forEach(function(expense) {

        let row =
            table.insertRow();


        // Expense name

        row.insertCell(0).innerText =
            expense.name;


        // Category

        row.insertCell(1).innerText =
            expense.category;


        // Amount

        row.insertCell(2).innerText =
            "₹" + expense.amount;


        // Date

        row.insertCell(3).innerText =
            expense.date;


        // ==========================================
        // ACTION COLUMN
        // ==========================================

        let actionCell =
            row.insertCell(4);


        // ==========================================
        // EDIT BUTTON
        // ==========================================

        let editButton =
            document.createElement("button");


        editButton.innerText =
            "Edit";


        editButton.onclick = function() {

            let newAmount =
                prompt(
                    "Enter new amount:",
                    expense.amount
                );


            if (
                newAmount !== null &&
                newAmount !== ""
            ) {

                newAmount =
                    Number(newAmount);


                if (
                    isNaN(newAmount) ||
                    newAmount <= 0
                ) {

                    alert(
                        "Please enter a valid amount."
                    );

                    return;
                }


                // Find original expense

                let originalExpense =
                    expenses.find(function(item) {

                        return item === expense;

                    });


                if (originalExpense) {

                    originalExpense.amount =
                        newAmount;

                }


                // Save

                saveExpenses();


                // Refresh display

                displayExpenses();

            }

        };


        // ==========================================
        // DELETE BUTTON
        // ==========================================

        let deleteButton =
            document.createElement("button");


        deleteButton.innerText =
            "Delete";


        deleteButton.onclick = function() {

            let confirmDelete =
                confirm(
                    "Are you sure you want to delete this expense?"
                );


            if (confirmDelete) {

                // Find original expense

                let expenseIndex =
                    expenses.indexOf(expense);


                if (expenseIndex !== -1) {

                    expenses.splice(
                        expenseIndex,
                        1
                    );

                }


                // Save

                saveExpenses();


                // Refresh

                displayExpenses();

            }

        };


        // Add buttons

        actionCell.appendChild(
            editButton
        );

        actionCell.appendChild(
            deleteButton
        );


        // ==========================================
        // CALCULATE TOTAL
        // ==========================================

        total =
            total +
            Number(expense.amount);


        // ==========================================
        // FIND HIGHEST EXPENSE
        // ==========================================

        if (
            Number(expense.amount) >
            highest
        ) {

            highest =
                Number(expense.amount);

        }

    });


    // ==========================================
    // UPDATE SUMMARY
    // ==========================================

    document.getElementById(
        "totalAmount"
    ).innerText = total;


    document.getElementById(
        "expenseCount"
    ).innerText =
        displayedExpenses.length;


    document.getElementById(
        "highestExpense"
    ).innerText =
        highest;


    // ==========================================
    // UPDATE CHART
    // ==========================================

    updateChart();

}



// ==========================================
// ADD EXPENSE
// ==========================================

function addExpense() {

    let expenseName =
        document.getElementById(
            "expenseName"
        ).value.trim();


    let category =
        document.getElementById(
            "category"
        ).value;


    let amount =
        document.getElementById(
            "amount"
        ).value;


    let date =
        document.getElementById(
            "date"
        ).value;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
        expenseName === "" ||
        amount === "" ||
        date === ""
    ) {

        alert(
            "Please fill all the fields."
        );

        return;
    }


    amount =
        Number(amount);


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        return;
    }


    // ==========================================
    // CREATE EXPENSE
    // ==========================================

    let expense = {

        name: expenseName,

        category: category,

        amount: amount,

        date: date

    };


    // Add expense

    expenses.push(expense);


    // Save

    saveExpenses();


    // Show all expenses

    displayedExpenses =
        [...expenses];


    // Refresh

    displayExpenses();


    // Clear form

    document.getElementById(
        "expenseName"
    ).value = "";


    document.getElementById(
        "amount"
    ).value = "";


    document.getElementById(
        "date"
    ).value = "";

}



// ==========================================
// SAVE EXPENSES
// ==========================================

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}



// ==========================================
// FILTER BY MONTH
// ==========================================

function filterByMonth() {

    let selectedMonth =
        document.getElementById(
            "monthFilter"
        ).value;


    // If no month selected

    if (selectedMonth === "") {

        displayedExpenses =
            [...expenses];

        displayExpenses();

        return;
    }


    // Filter expenses

    displayedExpenses =
        expenses.filter(function(expense) {

            return expense.date.startsWith(
                selectedMonth
            );

        });


    // Display filtered expenses

    displayExpenses();

}



// ==========================================
// SHOW ALL EXPENSES
// ==========================================

function showAllExpenses() {

    displayedExpenses =
        [...expenses];


    // Clear month selection

    document.getElementById(
        "monthFilter"
    ).value = "";


    // Display all

    displayExpenses();

}



// ==========================================
// UPDATE CHART
// ==========================================

function updateChart() {


    // Category totals

    let categoryTotals = {};


    // ==========================================
    // CALCULATE CATEGORY TOTALS
    // ==========================================

    displayedExpenses.forEach(
        function(expense) {


            if (
                categoryTotals[
                    expense.category
                ]
            ) {

                categoryTotals[
                    expense.category
                ] +=
                    Number(expense.amount);

            } else {

                categoryTotals[
                    expense.category
                ] =
                    Number(expense.amount);

            }

        }
    );


    // Categories

    let categories =
        Object.keys(
            categoryTotals
        );


    // Amounts

    let amounts =
        Object.values(
            categoryTotals
        );


    // Get chart

    let chartArea =
        document.getElementById(
            "expenseChart"
        );


    // Destroy previous chart

    if (expenseChart !== null) {

        expenseChart.destroy();

    }


    // ==========================================
    // CREATE CHART
    // ==========================================

    expenseChart =
        new Chart(
            chartArea,
            {

                type: "doughnut",


                data: {

                    labels:
                        categories,


                    datasets: [

                        {

                            label:
                                "Spending",

                            data:
                                amounts

                        }

                    ]

                },


                options: {

                    responsive: true,


                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );

}



// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

displayExpenses();