const { generateMatrix, readFileMatrix } = require('./file.js');
const { fullCombinationAlg, antAlgorithm } = require('./algorithms');
const fs = require('fs');
const prompt = require('prompt-sync')();

function median(sequence) {
    let sum = 0;
    sequence.map((item) => { sum += item; });

    return sum / sequence.length;
}

function testTime() {
    const sizeStart = +prompt("Введите начальный размер матрицы: ");
    if(isNaN(sizeStart)) {
        console.log("Требуется ввести число");
        return;
    }
    const sizeEnd = +prompt("Введите конечный размер матрицы: ");
    if(isNaN(sizeEnd)) {
        console.log("Требуется ввести число");
        return;
    }
    if (sizeStart > sizeEnd || sizeStart < 0 || sizeEnd < 0 || isNaN(sizeStart) || isNaN(sizeEnd)) {
        throw new Error('Неправильные размеры матриц');
    }
    
    const timeFullCombinations = [];
    const timeAntAlg = [];
    const sizes = Array.from({ length: sizeEnd - sizeStart + 1 }, (_, index) => index + sizeStart);
    let count = 0;
    let n = 10;
    console.log();

    sizes.forEach(size => {
        count += 1;
        const matrix = generateMatrix(size, 1, 2);

        let times = [];
        for (let i = 0; i < n; i++) {
            let startUsage = process.cpuUsage();
            fullCombinationAlg(matrix, size);
            let endUsage = process.cpuUsage(startUsage);
            let totalUserCPUTime = endUsage.user;
            let totalSystemCPUTime = endUsage.system;
            let totalCPUTime = (totalUserCPUTime + totalSystemCPUTime);
            times.push(totalCPUTime);
        }
        let average = median(times);
        timeFullCombinations.push(average);

        times = [];
        for (let i = 0; i < n; i++) {
            startUsage = process.cpuUsage();
            antAlgorithm(matrix, size, 0.5, 0.5, 0.5, 250);
            endUsage = process.cpuUsage(startUsage);
            totalUserCPUTime = endUsage.user;
            totalSystemCPUTime = endUsage.system;
            totalCPUTime = (totalUserCPUTime + totalSystemCPUTime);
            times.push(totalCPUTime);
        }
        average = median(times);
        timeAntAlg.push(average);
    });

    const output = fs.createWriteStream('data.csv');

    sizes.forEach((size, i) => {
        output.write(`${size.toString()},${timeFullCombinations[i].toFixed(3)},${timeAntAlg[i].toFixed(3)}`);
    });

    output.close();
}

function parametrization() {
    const alphaArr = Array.from({ length: 9 }, (_, index) => (index + 1) / 10);
    const kEvaArr = Array.from({ length: 8 }, (_, index) => (index + 1) / 10);
    const daysArr = [1, 3, 5, 10, 50, 100, 300, 500];

    const size = 8;

    const matrix1 = readFileMatrix('russia.csv');
    const matrix2 = readFileMatrix('faked.csv');

    const optimal1 = fullCombinationAlg(matrix1, size);
    const optimal2 = fullCombinationAlg(matrix2, size);

    const file1 = fs.createWriteStream('data/class1.csv');
    const file2 = fs.createWriteStream('data/class2.csv');

    let count = 0;
    const countAll = alphaArr.length * kEvaArr.length;
    
    const header = 'Alpha, KEva, Days, Optimal, Difference\n';
    file1.write(header);
    file2.write(header);

    console.log();

    alphaArr.forEach(alpha => {
        const beta = 1 - alpha;
        kEvaArr.forEach(kEva => {
            count += 1;

            daysArr.forEach(days => {
                const res1 = antAlgorithm(matrix1, size, alpha, beta, kEva, days);
                const res2 = antAlgorithm(matrix2, size, alpha, beta, kEva, days);

                let sep, ender;

                sep = ',';
                ender = '\n';

                if(Math.abs(res1[0] - optimal1[0]) < 0.01) {
                    const str1 = `${alpha.toFixed(1)}${sep}${kEva.toFixed(1)}${sep}${days}${sep}${optimal1[0]}${sep}${res1[0] - optimal1[0]}${ender}`;
                    file1.write(str1);
                }
                if(Math.abs(res2[0] - optimal2[0]) < 0.01) {
                    const str2 = `${alpha.toFixed(1)}${sep}${kEva.toFixed(1)}${sep}${days}${sep}${optimal2[0]}${sep}${res2[0] - optimal2[0]}${ender}`;
                    file2.write(str2);
                }
            });

            console.log(`Progress: ${((count / countAll) * 100).toFixed(0)}%`);
        });
    });

    file1.close();
    file2.close();
}

module.exports = {
    parametrization,
    testTime,
  };