import { multiplyClassic, multiplyVin, multiplyVinOpt } from "./algorithms.js";

const button = document.getElementById("start");
button.onclick = testAlgorithms;
const buttonT = document.getElementById("timeTest");
buttonT.onclick = timeTest;

// popup buttons
const buttonGener1 = document.querySelector("div#form1 button.generate");
buttonGener1.addEventListener("click", function() { check("one");});

const buttonGener2 = document.querySelector("div#form2 button.generate");
buttonGener2.addEventListener("click", function() { check("two");});

const buttonSubmit1 = document.querySelector("div#form1 button.submit");
buttonSubmit1.addEventListener("click", function() { getMatrix("one");});

const buttonSubmit2 = document.querySelector("div#form2 button.submit");
buttonSubmit2.addEventListener("click", function() { getMatrix("two");});

const buttonClean1 = document.querySelector("div#form1 button.clean");
buttonClean1.addEventListener("click", function() { clean("one");});

const buttonClean2 = document.querySelector("div#form2 button.clean");
buttonClean2.addEventListener("click", function() { clean("two");});

let ctx1 = document.getElementById('measureTime1').getContext('2d');
let ctx2 = document.getElementById('measureTime2').getContext('2d');


let tbl1 = document.querySelector("#form1 .table");
let tbl2 = document.querySelector("#form2 .table");

let sec1 = document.querySelector("#sec1 > div");
let sec2 = document.querySelector("#sec2 > div");
let sec3 = document.querySelector("#sec3 > div");

let answer1 = document.querySelector("#sec1 > .answer");
let answer2 = document.querySelector("#sec2 > .answer");
let answer3 = document.querySelector("#sec3 > .answer");


let n1 = 0;
let m1 = 0;
let n2 = 0;
let m2 = 0;

let matrixA = [];
let matrixB = [];

// reading values from DOM
function get_value(tag1, tag2) {
    const input1 = document.querySelector(tag1);
    const input2 = document.querySelector(tag2);
    const n = input1.value;
    const m = input2.value;

    console.log(n, m);
    return [n, m];
}

function round(number) {
    if (Number.isInteger(number)) {
        return number; 
    } else {
        return parseFloat(number.toFixed(3)); 
    }
}

function check(param) {
    let sizes;
    if(param === "one") {
        sizes = get_value("#form1 #firstLine", "#form1 #secondLine");
        console.log("one");
    }
    else {
        sizes = get_value("#form2 #firstLine", "#form2 #secondLine");
        console.log("two");
    }
    console.log(sizes);
    if(sizes[0] !== '' && sizes[1] !== '' && +sizes[0] > 0 && +sizes[1] > 0 && +sizes[0] % 1 === 0  && +sizes[1] % 1 === 0) {
        let n = +sizes[0], m = +sizes[1];
        console.log(n, m);
        if(param === "one"){
            if(n2 !== 0 && m2 !== 0) {
                if(m !== n2) {
                    alert("m первой матрицы должен быть равен n второй матрицы");
                    return;
                }
            }
            n1 = n;
            m1 = m;
            drawTable(n, m, tbl1);
        }
        else {
            if(n1 !== 0 && m1 !== 0) {
                if(n !== m1) {
                    alert("m первой матрицы должен быть равен n второй матрицы");
                    return;
                }
            }
            n2 = n;
            m2 = m;
            drawTable(n, m, tbl2);
        }
    }
    else {
        alert("Пожалуйста, введите натуральные числа");
    }
}

function getMatrix(param) {
    let table;
    let n, m;
    if(param === "one") {
        if (n1 === 0 || m1 === 0) {
            alert("Пожалуйста, введите n и m и нажмите кнопку 'Построить матрицу'");
            return;
        }
        table = document.querySelector("#form1 .table table");
        n = n1;
        m = m1;
    }
    else{
        if (n2 === 0 || m2 === 0) {
            alert("Пожалуйста, введите n и m и нажмите кнопку 'Построить матрицу'");
            return;
        }
        table = document.querySelector("#form2 .table table");
        n = n2;
        m = m2;
    }
    console.log(table);
    let matrix = [];
    let rows = table.rows;
    for (let i = 0; i < n; i++) {
        let row = rows[i];
        let rowData = [];
        for (let j = 0; j < m; j++) {
            let cell = row.cells[j];
            if(cell.firstChild.value !== '' && !isNaN(+cell.firstChild.value)) {
                rowData.push(+cell.firstChild.value);
            }
            else {
                matrix = [];
                alert("Пожалуйста, введите во все ячейки целые или вещественные числа");
                return;
            }
        }
        matrix.push(rowData);
    }
    if(param === "one") matrixA = matrix;
    else matrixB = matrix;

    console.log(matrixA, matrixB);
}
// delete from DOM
function clean(param) {
    let section;    
    let input1, input2;
    if(param === "one") {
        section = tbl1;
        n1 = 0;
        m1 = 0;
        matrixA = [];
        input1 = document.querySelector("#form1 #firstLine");
        input2 = document.querySelector("#form1 #secondLine");
    }
    else {
        section = tbl2;
        n2 = 0;
        m2 = 0;
        matrixB = [];
        input1 = document.querySelector("#form2 #firstLine");
        input2 = document.querySelector("#form2 #secondLine");
    }
    console.log(input1.value, input2.value);
    section.textContent = "";
    input1.value = "";
    input2.value = "";
}

// creating new elements of DOM
function createInputTable(n, m) {
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");

    table.appendChild(tbody);

    for (let i = 0; i < n; i++) {
        let row = tbody.insertRow(i);
        for (let j = 0; j < m; j++) {
            let cell = row.insertCell(j);
            let input = document.createElement("input");
            input.type = "text";
            input.className = "matrixCell";
            cell.appendChild(input);
        }
    }
    table.appendChild(tbody);

    return table;
}

function createOutputTable(result, rows, cols) {
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");

    table.appendChild(tbody);

    let name, nameText;
    for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
                name = document.createElement("td");
                nameText = document.createTextNode(`${round(result[i][j])}`);
            name.appendChild(nameText);
            row.appendChild(name);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    console.log(table);
    return table;
}

function drawTable(n, m, section) {
    let table = createInputTable(
        n,
        m
    );
    section.textContent = "";
    if (n > 10 || m > 10) {
        section.style.removeProperty("display");
        section.style.removeProperty("justify-content");
        section.style.removeProperty("align-items");
        section.style.cssText += "overflow: scroll;";
    } 
    else {
        section.style.removeProperty("overflow");
        section.style.cssText += "display: flex; justify-content: center; align-items: center;";
    }
    section.appendChild(table);
}

function drawMatrix(n, m, res, section, answer) {
    let table = createOutputTable(res, n, m);
    section.textContent = "";
    if (m > 15) {
        section.style.cssText += "overflow-x: scroll;";
        answer.style.cssText += "align-items: center;";
        answer.style.removeProperty("justify-content");
    } 
    if (n > 7) {
        section.style.cssText += "overflow-y: scroll;";
        section.style.removeProperty("align-items");
    } 
    if( n <= 7) {
        section.style.removeProperty("overflow-y");
        answer.style.cssText += "align-items: center;";
    }
    if( m <= 15) {
        section.style.removeProperty("overflow-x");
        answer.style.cssText += "align-items: center;";
        answer.style.cssText += "justify-content: center;";
    }
    section.appendChild(table);
}

// main functions for start
function testAlgorithms() {
    if (matrixA.length === 0 || matrixB.length === 0) {
        alert("Пожалуйста, введите две матрицы");
    } else {
        let matrixClassic = multiplyClassic(matrixA, matrixB);
        drawMatrix(n1, m2, matrixClassic, sec1, answer1);

        let matrixVin = multiplyVin(matrixA, matrixB);
        drawMatrix(n1, m2, matrixVin, sec2, answer2);

        let matrixVinOpt = multiplyVinOpt(matrixA, matrixB);
        drawMatrix(n1, m2, matrixVinOpt, sec3, answer3);
    }
}

function timeTest() {
    fetch("measures.json")
    .then((response) => response.json())
    .then((data) => {
        let measures1 = data.slice(0, 12);
        let measures2 = data.slice(12, 24);
        let measures3 = data.slice(24, 36);
        let measures4 = data.slice(36, 48);
        let measures5 = data.slice(48, 60);
        let measures6 = data.slice(60, 72);
        let chart1 = new Chart(ctx1, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Стандартный алгоритм',
                    data: measures1.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Алгоритм Винограда',
                    data: measures2.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Оптимизированный алгоритм Винограда',
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
                    label: 'Стандартный алгоритм',
                    data: measures4.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Алгоритм Винограда',
                    data: measures5.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Оптимизированный алгоритм Винограда',
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
    });
}
