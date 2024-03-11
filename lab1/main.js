import { nonrecursiveL, nonrecursiveDL, recursiveDL, DLCash } from "./algorithms.js";

const button = document.getElementById("start");
button.onclick = testAlgoritms;
const buttonT = document.getElementById("timeTest");
buttonT.onclick = timeTest;
let ctx1 = document.getElementById('measureTime1').getContext('2d');
let ctx2 = document.getElementById('measureTime2').getContext('2d');

let sec1 = document.querySelector("#sec1 > div > div");
let sec2 = document.querySelector("#sec2 > div > div");
let sec3 = document.querySelector("#sec3 > div > div");
let sec4 = document.querySelector("#sec4 > div > div");

let sp1 = document.querySelector("#sp1");
let sp2 = document.querySelector("#sp2");
let sp3 = document.querySelector("#sp3");
let sp4 = document.querySelector("#sp4");

let matrixL;
let matrixNonDL;
let directionDL;
let matrixCashDL;

function get_value() {
    const inputs = document.getElementsByTagName("input");
    const str1 = inputs[0].value;
    const str2 = inputs[1].value;

    return [str1, str2];
}

function create_table(result, rows, cols, str1, str2) {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    table.appendChild(thead);
    table.appendChild(tbody);

    const title = document.createElement("tr");
    let name = document.createElement("th");
    let nameText = document.createTextNode(``);
    name.appendChild(nameText);
    title.appendChild(name);
    name = document.createElement("th");
    nameText = document.createTextNode(`λ`);
    name.appendChild(nameText);
    title.appendChild(name);
    for (let i = 0; i < cols - 2; i++) {
        name = document.createElement("th");
        nameText = document.createTextNode(str2[i]);
        name.appendChild(nameText);
        title.appendChild(name);
    }
    thead.appendChild(title);
    table.appendChild(thead);

    for (let i = 0; i < rows - 1; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            if (j === 0) {
                name = document.createElement("th");
                if (i === 0) {
                    nameText = document.createTextNode(`λ`);
                } else {
                    nameText = document.createTextNode(str1[i - 1]);
                }
            } else {
                name = document.createElement("td");
                nameText = document.createTextNode(`${result[i][j - 1]}`);
            }
            name.appendChild(nameText);
            row.appendChild(name);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);

    return table;
}

function drawMatrix(matrix, section, str1, str2) {
    let table = create_table(
        matrix,
        matrix.length + 1,
        matrix[0].length + 1,
        str1,
        str2
    );
    section.textContent = "";
    if (str1.length > 12) {
        section.style.cssText += "overflow:scroll;";
    } 
    else {
        section.style.removeProperty("overflow");
    }
    section.appendChild(table);
}

function drawAnswer(section, res, line) {
    section.textContent = "";
    section.textContent = line + res;
}

function testAlgoritms() {
    let words = get_value();
    if (words[0] === "" || words[1] === "") {
        alert("Пожалуйста, заполните оба поля");
    } else {
        matrixL = nonrecursiveL(words[0], words[1]);
        matrixNonDL = nonrecursiveDL(words[0], words[1]);
        directionDL = recursiveDL(words[0], words[1]);
        matrixCashDL = DLCash(words[0], words[1]);

        drawAnswer(sp1, matrixL[0], 'Расстояние Левенштейна ')
        drawMatrix(matrixL[1], sec1, words[0], words[1]);

        drawAnswer(sp2, matrixNonDL[0], 'Расстояние Дамерау-Левенштейна ')
        drawMatrix(matrixNonDL[1], sec2, words[0], words[1]);

        drawAnswer(sp3, directionDL, 'Расстояние Дамерау-Левенштейна ')

        drawAnswer(sp4, matrixCashDL[0], 'Расстояние Дамерау-Левенштейна ');
        drawMatrix(matrixCashDL[1], sec4, words[0], words[1]);
    }
}

function timeTest() {
    fetch("measures.json")
    .then((response) => response.json())
    .then((data) => {
        let measures1 = data.slice(0, 15);
        let measures2 = data.slice(15, 30);
        let measures3 = data.slice(30, 40);
        let measures4 = data.slice(40, 50);
        let chart1 = new Chart(ctx1, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Нерекурсивный алгоритм нахождения расстояния Левенштейна',
                    data: measures1.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Нерекурсивный алгоритм нахождения расстояния Дамерау-Левенштейна',
                    data: measures2.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(54, 162, 235, 1)',
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
                    label: 'Рекурсивный алгоритм нахождения расстояния Дамерау-Левенштейна',
                    data: measures3.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Рекурсивный алгоритм нахождения расстояния Дамерау-Левенштейна с кешированием',
                    data: measures4.map(({ time, length }) => ({x: length, y: time})),
                    borderColor: 'rgba(75, 192, 192, 1)',
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
