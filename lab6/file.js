const fs = require('fs');
const { execSync } = require('child_process');
const prompt = require('prompt-sync')();
const { fullCombinationAlg, antAlgorithm } = require('./algorithms.js'); 


function generateMatrix(size, randStart, randEnd) {
    const matrix = Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => {
            const num = i === j ? 0 : Math.floor(Math.random() * (randEnd - randStart + 1)) + randStart;
            return num;
        })
    );

    return matrix;
}

function generateMatrixFile(filename, size, randStart, randEnd) {
    const matrix = generateMatrix(size, randStart, randEnd);
    const fileContent = matrix.map(row => row.join(' ')).join('\n');

    fs.writeFileSync(`data/${filename}`, fileContent);

    return `File ${filename} generated\n`;
}

function readFileMatrix(filename) {
    const fileContent = fs.readFileSync(`data/${filename}`, 'utf-8');
    const lines = fileContent.trim().split('\n');
    const size = lines[0].split(' ').length;

    const matrix = lines.map(line => line.split(' ').map(Number));

    return matrix;
}

function listDataFiles() {
    execSync('ls data > files.txt');
    const files = fs.readFileSync('files.txt', 'utf-8').trim().split('\n');

    console.log(`\n\nДоступные файлы: ${files.length} штук`);
    files.forEach((file, index) => console.log(`${index + 1}. ${file}`));

    return files;
}

function updateFile() {
    try {
        const option = parseInt(prompt('Добавить новый файл? (1 - да, 2 - нет): '));

        if (option === 1) {
            const fileName = prompt('Введите имя файла: ');
            const size = parseInt(prompt('Введите размер матрицы: '));
            const randStart = parseInt(prompt('Введите начальное число рандома: '));
            const randEnd = parseInt(prompt('Введите конечное число рандома: '));
            console.log(generateMatrixFile(fileName, size, randStart, randEnd));
        } else if (option === 2) {
            const files = listDataFiles();
            const numFile = parseInt(prompt('Выберите файл: ')) - 1;
            const size = parseInt(prompt('Введите размер матрицы: '));
            const randStart = parseInt(prompt('Введите начальное число рандома: '));
            const randEnd = parseInt(prompt('Введите конечное число рандома: '));
            console.log(generateMatrixFile(files[numFile], size, randStart, randEnd));
        } else {
            console.log('Ошибка: Неверно выбран пункт');
        }

        console.log('Успешно обновлен список файлов\n');
    } catch (error) {
        console.log('Ошибка');
    }
}

function readMatrix() {
    const matrix = readFileMatrix("russia.csv");
    return matrix;
}

function parseFullCombinations() {
    const matrix = readMatrix();
    const size = matrix.length;
    const result = fullCombinationAlg(matrix, size);
    console.log(`\n\nМинимальная сумма пути = ${result[0]}\nПуть: ${result[1]}`);
}

function readKoeffs() {
    const alpha = prompt('Введите коэффициент жадности α: ');
    if(isNaN(alpha)) {
        console.log("Требуется ввести число");
        return;
    }
    const beta = 1 - alpha;
    const k_evaporation = parseFloat(prompt('Введите коэффициент испарения ρ: '));
    if(isNaN(k_evaporation)) {
        console.log("Требуется ввести число");
        return;
    }
    const days = parseInt(prompt('Введите количество дней: '));
    if(isNaN(days)) {
        console.log("Требуется ввести число");
        return;
    }
    return [alpha, beta, k_evaporation, days];
}

function parseAntAlg() {
    const matrix = readMatrix();
    const size = matrix.length;
    const koeffs = readKoeffs();
    if(koeffs.length === 0) {
        return;
    }
    const result = antAlgorithm(matrix, size, koeffs[0], koeffs[1], koeffs[2], koeffs[3]);
    console.log(`\n\nМинимальная сумма пути = ${result[0]}\nПуть: ${result[1]}`);
}

module.exports = {
    parseFullCombinations,
    parseAntAlg,
    updateFile,
    generateMatrix, 
    readFileMatrix
  };