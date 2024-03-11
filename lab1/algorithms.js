function createMatrix(matrix, n, m, fill) {
    for (let i = 0; i < n; i++) {
        matrix[i] = [];
        for (let j = 0; j < m; j++) {
            matrix[i][j] = fill;
        }
    }
}

export function nonrecursiveL(str1, str2) {
    let n = str1.length;
    let m = str2.length;
    let matrix = [];
    createMatrix(matrix, n + 1, m + 1, 0);
    for (let i = 0; i < n + 1; i++) {
        for (let j = 0; j < m + 1; j++) {
            if (i === 0 && j === 0) {
                matrix[i][j] = 0;
            }
            else if (i === 0) {
                matrix[i][j] = j;
            }
            else if (j === 0) {
                matrix[i][j] = i;
            }
            else {
                let diff = 1;
                if (str1[i - 1].localeCompare(str2[j - 1]) === 0) {
                    diff = 0;
                }
                matrix[i][j] = Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1, matrix[i - 1][j - 1] + diff);
            }
        }
    }

    return [matrix[n][m], matrix];
}

export function nonrecursiveDL(str1, str2) {
    let n = str1.length;
    let m = str2.length;
    let matrix = [];
    createMatrix(matrix, n + 1, m + 1, 0);
    for (let i = 0; i < n + 1; i++) {
        for (let j = 0; j < m + 1; j++) {
            if (i === 0 && j === 0) {
                matrix[i][j] = 0;
            }
            else if (i === 0) {
                matrix[i][j] = j;
            }
            else if (j === 0) {
                matrix[i][j] = i;
            }
            else {
                let diff = 1;
                if (str1[i - 1].localeCompare(str2[j - 1]) === 0) {
                    diff = 0;
                }
                if (i > 1 && j > 1 && str1[i - 1] === str2[j - 2] && str1[i - 2] === str2[j - 1]) {
                    matrix[i][j] = Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1, matrix[i - 1][j - 1] + diff, matrix[i - 2][j - 2] + 1);
                }
                else {
                    matrix[i][j] = Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1, matrix[i - 1][j - 1] + diff);
                }
            }
        }
    }

    return [matrix[n][m], matrix];
}

export function recursiveDL(str1, str2) {
    let n = str1.length;
    let m = str2.length;
    if (n === 0 || m == 0) {
        return Math.abs(n - m);
    }
    let diff = 1;
    if (str1[n - 1].localeCompare(str2[m - 1]) === 0) {
        diff = 0;
    }
    let insertOp = recursiveDL(str1, str2.slice(0, m - 1)) + 1;
    let deleteOp = recursiveDL(str1.slice(0, n - 1), str2) + 1;
    let replaceOP = recursiveDL(str1.slice(0, n - 1), str2.slice(0, m - 1)) + diff;
    if (n > 1 && m > 1 && str1[n - 1] === str2[m - 2] && str1[n - 2] === str2[m - 1]) {
        return Math.min(insertOp, deleteOp, replaceOP, recursiveDL(str1.slice(0, n - 2), str2.slice(0, m - 2)) + 1);
    }
    else {
        return Math.min(insertOp, deleteOp, replaceOP);
    }
}

function recursiveDLCash (str1, str2, matrix){
    let n = str1.length;
    let m = str2.length;
    if(n === 0){
        matrix[n][m] = m;
        return m;
    }
    if(m === 0){
        matrix[n][m] = n;
        return n;
    }
    let diff = 1;
    if (str1[n - 1].localeCompare(str2[m - 1]) === 0) {
        diff = 0;
    }
    let insertOp = recursiveDLCash(str1, str2.slice(0, m - 1), matrix) + 1;
    let deleteOp = recursiveDLCash(str1.slice(0, n - 1), str2, matrix) + 1;
    let replaceOP = recursiveDLCash(str1.slice(0, n - 1), str2.slice(0, m - 1), matrix) + diff;
    if (n > 1 && m > 1 && str1[n - 1] === str2[m - 2] && str1[n - 2] === str2[m - 1]) {
        matrix[n][m] = Math.min(insertOp, deleteOp, replaceOP, recursiveDLCash(str1.slice(0, n - 2), str2.slice(0, m - 2), matrix) + 1);
    }
    else {
        matrix[n][m] = Math.min(insertOp, deleteOp, replaceOP);
    }

    return matrix[n][m];
}

export function DLCash(str1, str2) {
    let n = str1.length;
    let m = str2.length;
    let matrix = [];
    createMatrix(matrix, n + 1, m + 1, -1);
    let distance = recursiveDLCash(str1, str2, matrix);

    return [distance, matrix];
}