import { quickSort, combSort, binaryTreeSort } from "./algorithms.js";

const button = document.getElementById("start");
button.onclick = testAlgorithms;
const buttonT = document.getElementById("timeTest");
buttonT.onclick = timeTest;

// popup buttons
const buttonGener1 = document.querySelector("div#form1 button.generate");
buttonGener1.addEventListener("click", function() { check();});

const buttonSubmit1 = document.querySelector("div#form1 button.submit");
buttonSubmit1.addEventListener("click", function() { getMatrix();});

const buttonClean1 = document.querySelector("div#form1 button.clean");
buttonClean1.addEventListener("click", function() { clean();});

let ctx1 = document.getElementById('measureTime1').getContext('2d');
let ctx2 = document.getElementById('measureTime2').getContext('2d');
let ctx3 = document.getElementById('measureTime3').getContext('2d');

let tbl1 = document.querySelector("#form1 .table");

let sec1 = document.querySelector("#sec1 > div");
let sec2 = document.querySelector("#sec2 > div");
let sec3 = document.querySelector("#sec3 > div");

let answer1 = document.querySelector("#sec1 > .answer");
let answer2 = document.querySelector("#sec2 > .answer");
let answer3 = document.querySelector("#sec3 > .answer");

// let n1 = 30;
// let arr = [1, 8, 5, 0, 1, 4, 8, 2, -4, 10, -11, -3, 2.3, 4.9, 15, 13, 14, 157, 357, 2, 1,2 ,3 ,4 ,5, 6, 7, -3, -5, -6.7];
let n1 = 0;
let arr = [];

// reading values from DOM
function get_value(tag1) {
    const input1 = document.querySelector(tag1);
    const n = input1.value;
    return n;
}

function round(number) {
    if (Number.isInteger(number)) {
        return number; 
    } else {
        return parseFloat(number.toFixed(3)); 
    }
}

function check(param) {
    let size = get_value("#form1 #firstLine");
    if(size !== '' && +size > 0 && +size % 1 === 0) {
        let n = +size;
        n1 = n;
        drawTable(n, tbl1);
    }
    else {
        alert("Пожалуйста, введите натуральное число");
    }
}

function getMatrix(param) {
    let table;
    let n;
    if (n1 === 0) {
        alert("Пожалуйста, введите n и нажмите кнопку 'Построить массив'");
        return;
    }
    table = document.querySelector("#form1 .table table");
    n = n1;
    let array = [];
    let row = table.rows[0];
    for (let j = 0; j < n; j++) {
        let cell = row.cells[j];
        if(cell.firstChild.value !== '' && !isNaN(+cell.firstChild.value)) {
            array.push(+cell.firstChild.value);
        }
        else {
            array = [];
            alert("Пожалуйста, введите во все ячейки целые или вещественные числа");
            return;
        }
    }
    arr = array;

    console.log(arr);
}
// delete from DOM
function clean(param) {
    let section = tbl1;    
    let input1 = document.querySelector("#form1 #firstLine");
    n1 = 0;
    arr = [];
    section.textContent = "";
    input1.value = "";
    section.style.removeProperty("overflow-x");
}

// creating new elements of DOM
function createInputTable(n) {
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");

    table.appendChild(tbody);

    let row = tbody.insertRow();
    for (let j = 0; j < n; j++) {
        let cell = row.insertCell(j);
        let input = document.createElement("input");
        input.type = "text";
        input.className = "matrixCell";
        cell.appendChild(input);
    }
    table.appendChild(tbody);

    return table;
}

function createOutputTable(result, cols) {
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");

    table.appendChild(tbody);

    let name, nameText;
    const row = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
        name = document.createElement("td");
        nameText = document.createTextNode(`${round(result[j])}`);
        name.appendChild(nameText);
        row.appendChild(name);
    }
    tbody.appendChild(row);
    table.appendChild(tbody);

    return table;
}

function drawTable(n, section) {
    let table = createInputTable(n);
    section.textContent = "";
    if (n > 10) {
        section.style.removeProperty("display");
        section.style.removeProperty("justify-content");
        section.style.removeProperty("align-items");
        section.style.cssText += "overflow-x: scroll;";
    } 
    else {
        section.style.removeProperty("overflow-x");
        section.style.cssText += "display: flex; justify-content: center; align-items: center;";
    }
    section.appendChild(table);
}

function drawMatrix(n, res, section, answer) {
    let table = createOutputTable(res, n);
    section.textContent = "";
    if (n > 25) {
        section.style.cssText += "overflow-x: scroll;";
        answer.style.removeProperty("justify-content");
    } 
    else {
        section.style.removeProperty("overflow-x");
        answer.style.cssText += "justify-content: center;";
    }
    section.appendChild(table);
}

// main functions for start
function testAlgorithms() {
    if (arr.length === 0) {
        alert("Пожалуйста, введите массив");
    } else {
        let inputArr = [...arr];
        let arrQuick = quickSort(inputArr);
        drawMatrix(n1, arrQuick, sec1, answer1);
        inputArr = arr;
        let arrComb = combSort(inputArr);
        drawMatrix(n1, arrComb, sec2, answer2);
        inputArr = arr;
        let arrBin = binaryTreeSort(inputArr);
        drawMatrix(n1, arrBin, sec3, answer3);
    }
}

function timeTest() {
    fetch("measures.json")
    .then((response) => response.json())
    .then((data) => {
        let measures1 = data.slice(0, 9);
        let measures2 = data.slice(9, 18);
        let measures3 = data.slice(18, 27);
        let measures4 = data.slice(27, 36);
        let measures5 = data.slice(36, 45);
        let measures6 = data.slice(45, 54);
        let measures7 = data.slice(54, 63);
        let measures8 = data.slice(63, 72);
        let measures9 = data.slice(72, 81);
        let chart1 = new Chart(ctx1, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Быстрая сортировка - лучший',
                    data: measures1.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Сортировка расчёской - лучший',
                    data: measures2.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Сортировка бинарным деревом - лучший',
                    data: measures3.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        let chart2 = new Chart(ctx2, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Быстрая сортировка - средний',
                    data: measures4.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Сортировка расчёской - средний',
                    data: measures5.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Сортировка бинарным деревом - средний',
                    data: measures6.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        let chart3 = new Chart(ctx3, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Быстрая сортировка - худший',
                    data: measures7.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Сортировка расчёской - худший',
                    data: measures8.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Сортировка бинарным деревом - худший',
                    data: measures9.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
}
