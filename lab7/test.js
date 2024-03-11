const { fullSearch, binarySearch } = require('./algorithms.js');
const fs = require('fs');
const prompt = require('prompt-sync')();

function inputArray() {
    const input = prompt('Введите числа через пробел:');
    const array = input.trim().split(' ').map(item => parseInt(item));
    array.forEach((element) => {
        if (isNaN(element)) {
        return false;
        }
    });
    return array;
}

function inputNumber() {
    const input = prompt('Введите число для поиска:');
    const num = parseInt(input);
    if (isNaN(num)) {
        return false;
    }

    return num;
}

let testLength = [256, 1024, 4096, 16384, 65536];
let timeN = 100;

function median(sequence) {
    let sum = 0;
    sequence.map((item) => { sum += item; });

    return sum / sequence.length;
}

function measureTime(algorithm, arr, number, n) {
    let times = [];
    for (let i = 0; i < n; i++) {
        const startUsage = process.cpuUsage();
        let index = algorithm(arr, number);
        const endUsage = process.cpuUsage(startUsage);
        let totalUserCPUTime = endUsage.user;
        let totalSystemCPUTime = endUsage.system;
        let totalCPUTime = (totalUserCPUTime + totalSystemCPUTime);
        times.push(totalCPUTime);
    }
    let average = median(times);

    return average;
}

function generateIncreaseArray(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        let value = i +1;
        arr.push(value);
    }

    return arr;
}

function timeTest() {
    let measures1 = [];
    let measures2 = [];
    let measures3 = [];
    let measures4 = [];
    for (let i = 0; i < testLength.length; i++) {
        let arr = generateIncreaseArray(testLength[i]);

        measures1.push(measureTime(fullSearch, arr, 1, timeN));
        console.log("Progress: measure1 for ", testLength[i]);

        measures2.push(measureTime(fullSearch, arr, testLength[i], timeN));
        console.log("Progress: measure2 for ", testLength[i]);

        measures3.push(measureTime(binarySearch, arr, Math.floor((1 + testLength[i]) /2), timeN));
        console.log("Progress: measure3 for ", testLength[i]);

        measures4.push(measureTime(binarySearch, arr, testLength[i], timeN));
        console.log("Progress: measure4 for ", testLength[i]);

    }

    const file = fs.createWriteStream('times.csv');    
    const header = 'size, fullbest, fullbad, binbest, binbad\n';
    file.write(header);

    for(let i = 0; i < testLength.length; i++) {
        let sep, ender;
        sep = ',';
        ender = '\n';

        const str = `${testLength[i]}${sep}${measures1[i].toFixed(3)}${sep}${measures2[i].toFixed(3)}${sep}${measures3[i].toFixed(3)}${sep}${measures4[i].toFixed(3)}${ender}`;
        file.write(str);
    }
    file.close();
}

module.exports = {
    inputArray,
    inputNumber,
    timeTest
  };