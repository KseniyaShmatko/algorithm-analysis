import("./algorithms.js").then((algorithms) => {
    const { quickSort, combSort, binaryTreeSort } = algorithms;
    const fs = require("fs");

let testLength = [100, 200, 300, 400, 500, 600, 700, 800, 900];
let timeN = 100;
let addy = 1;

function median(sequence) {
    let sum = 0;
    sequence.map((item) => { sum += item; });

    return sum / sequence.length;
}

function measureTime(algorithm, arr, n) {
    let times = [];
    let copy;
    for (let i = 0; i < n; i++) {
        copy = arr;
        const startUsage = process.cpuUsage();
        algorithm(copy);
        const endUsage = process.cpuUsage(startUsage);
        let totalUserCPUTime = endUsage.user;
        let totalSystemCPUTime = endUsage.system;
        let totalCPUTime = (totalUserCPUTime + totalSystemCPUTime);
        times.push(totalCPUTime);
    }
    let average = median(times);

    return average;
}

function generateRandomArray(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        let randomValue = Math.floor(Math.random() * 101);
        arr.push(randomValue);
    }

    return arr;
}

function generateIncreaseArray(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        let value = i + addy;
        arr.push(value);
    }
    addy++;

    return arr;
}

function timeTest() {
    let measures1 = [];
    let measures2 = [];
    let measures3 = [];
    let measures4 = [];
    let measures5 = [];
    let measures6 = [];
    let measures7 = [];
    let measures8 = [];
    let measures9 = [];
    for (let i = 0; i < testLength.length; i++) {
        measures1.push(measureTime(quickSort, generateIncreaseArray(testLength[i]), timeN));
        measures2.push(measureTime(combSort, generateIncreaseArray(testLength[i]),  timeN));
        measures3.push(measureTime(binaryTreeSort, generateIncreaseArray(testLength[i]), timeN));
        measures4.push(measureTime(quickSort, generateRandomArray(testLength[i]), timeN));
        measures5.push(measureTime(combSort, generateRandomArray(testLength[i]),  timeN));
        measures6.push(measureTime(binaryTreeSort, generateRandomArray(testLength[i]), timeN));
        measures7.push(measureTime(quickSort, generateIncreaseArray(testLength[i]).reverse(), timeN));
        measures8.push(measureTime(combSort, generateIncreaseArray(testLength[i]).reverse(),  timeN));
        measures9.push(measureTime(binaryTreeSort, generateIncreaseArray(testLength[i]).reverse(), timeN));
    }

    const timeData = [];
    for (let measure of [measures1, measures2, measures3]) {
        for (let i = 0; i < measure.length; i++) {
            timeData.push({time: measure[i], length: testLength[i]});
        }
    }

    for (let measure of [measures4, measures5, measures6]) {
        for (let i = 0; i < measure.length; i++) {
            timeData.push({time: measure[i], length: testLength[i]});
        }
    }

    for (let measure of [measures7, measures8, measures9]) {
        for (let i = 0; i < measure.length; i++) {
            timeData.push({time: measure[i], length: testLength[i]});
        }
    }
    
    const jsonData = JSON.stringify(timeData);

    fs.writeFileSync("measures.json", jsonData, "utf8");
}

timeTest();

});