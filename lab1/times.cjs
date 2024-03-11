import("./algorithms.js").then((algoritms) => {
    const { nonrecursiveL, nonrecursiveDL, recursiveDL, DLCash } = algoritms;
    const fs = require("fs");

let test = ['a', 'an', 'cat', 'tale', 'seven', 'август', 'витамин', 'акварель', 'автопилот', 'абстракция', 'CHEMICOPHYSIOLOGICAL', 'asdfghjklcvbdnmertyuiasdfghvby', 'asdfghjklcvbnmertyuiasdfghvbynfdafagxhbje1tcvjrfge', 'asdfghjklcvbnmertyuiasdfghvbynfdafagxhbjetcvjrfgedasdfghjklcvbnmertyuiasdfghvbynfdafagxhbjet1cvjrfged', 'asdfghjklcvbnmertyuiasdfghvbynfdafagxhbjetcvjrfgedasdfghjklcvbnmertyuiasdfghvbyasdfghjklcvbnmertyuiasdfghvbynfdafagxhbjetcvjrfgedasdfghjklcvbnmertyuiasdfghvbynfdafagxhbjet1cvjrfgednfdafagxhbjet1cvjrfged'];
let testLength = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 50, 100, 200];
let timeN = 200;

function median(sequence) {
    let sum = 0;
    sequence.map((item) => { sum += item; });

    return sum / sequence.length;
}

function measureTime(algorithm, str1, str2, n) {
    let times = [];
    for (let i = 0; i < n; i++) {
        const startUsage = process.cpuUsage();
        algorithm(str1, str2);
        const endUsage = process.cpuUsage(startUsage);
        let totalUserCPUTime = endUsage.user;
        let totalSystemCPUTime = endUsage.system;
        let totalCPUTime = (totalUserCPUTime + totalSystemCPUTime);
        times.push(totalCPUTime);
    }
    let average = median(times);

    return average;
}

function reverseStr(str) {
    return str.split("").reverse().join("");
}

function timeTest() {
    let measures1 = [];
    let measures2 = [];
    let measures3 = [];
    let measures4 = [];
    for (let i = 0; i < test.length; i++) {
        measures1.push(measureTime(nonrecursiveL, test[i], reverseStr(test[i]), timeN));
        measures2.push(measureTime(nonrecursiveDL, test[i], reverseStr(test[i]), timeN));
        if (i < 10) {
            measures3.push(measureTime(recursiveDL, test[i], reverseStr(test[i]), timeN));
            measures4.push(measureTime(DLCash, test[i], reverseStr(test[i]), timeN));
        }
    }

    const timeData = [];
    for (let measure of [measures1, measures2, measures3, measures4]) {
        for (let i = 0; i < measure.length; i++) {
            timeData.push({time: measure[i], length: testLength[i]});
        }
    }

    const jsonData = JSON.stringify(timeData);

    fs.writeFileSync("measures.json", jsonData, "utf8");
}

timeTest();

});