import("./algorithms.js").then((algorithms) => {
    const { multiplyClassic, multiplyVin, multiplyVinOpt  } = algorithms;
    const fs = require("fs");

let testLength = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200];
let testLengthOdd = [11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 151, 201];
let timeN = 100;

function median(sequence) {
    let sum = 0;
    sequence.map((item) => { sum += item; });

    return sum / sequence.length;
}

function measureTime(algorithm, mtr1, mtr2, n) {
    let times = [];
    for (let i = 0; i < n; i++) {
        const startUsage = process.cpuUsage();
        algorithm(mtr1, mtr2);
        const endUsage = process.cpuUsage(startUsage);
        let totalUserCPUTime = endUsage.user;
        let totalSystemCPUTime = endUsage.system;
        let totalCPUTime = (totalUserCPUTime + totalSystemCPUTime);
        times.push(totalCPUTime);
    }
    let average = median(times);

    return average;
}

function generateRandomMatrix(rows) {
    var matrix = [];
    for (var i = 0; i < rows; i++) {
        var row = [];
        for (var j = 0; j < rows; j++) {
            var randomValue = Math.floor(Math.random() * 101);
            row.push(randomValue);
        }
        matrix.push(row);
    }
    return matrix;
}

function timeTest() {
    let measures1 = [];
    let measures2 = [];
    let measures3 = [];
    let measures4 = [];
    let measures5 = [];
    let measures6 = [];
    for (let i = 0; i < testLength.length; i++) {
        measures1.push(measureTime(multiplyClassic, generateRandomMatrix(testLength[i]), generateRandomMatrix(testLength[i]), timeN));
        measures2.push(measureTime(multiplyVin, generateRandomMatrix(testLength[i]), generateRandomMatrix(testLength[i]), timeN));
        measures3.push(measureTime(multiplyVinOpt, generateRandomMatrix(testLength[i]), generateRandomMatrix(testLength[i]), timeN));
        measures4.push(measureTime(multiplyClassic, generateRandomMatrix(testLengthOdd[i]), generateRandomMatrix(testLengthOdd[i]), timeN));
        measures5.push(measureTime(multiplyVin, generateRandomMatrix(testLengthOdd[i]), generateRandomMatrix(testLengthOdd[i]), timeN));
        measures6.push(measureTime(multiplyVinOpt, generateRandomMatrix(testLengthOdd[i]), generateRandomMatrix(testLengthOdd[i]), timeN));
    }

    const timeData = [];
    for (let measure of [measures1, measures2, measures3]) {
        for (let i = 0; i < measure.length; i++) {
            timeData.push({time: measure[i], length: testLength[i] * testLength[i]});
        }
    }

    for (let measure of [measures4, measures5, measures6]) {
        for (let i = 0; i < measure.length; i++) {
            timeData.push({time: measure[i], length: testLengthOdd[i] * testLengthOdd[i]});
        }
    }
    
    const jsonData = JSON.stringify(timeData);

    fs.writeFileSync("measures.json", jsonData, "utf8");
}

timeTest();

});