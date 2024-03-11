function createMatrix(matrix, n, m, fill) {
    for (let i = 0; i < n; i++) {
        matrix[i] = [];
        for (let j = 0; j < m; j++) {
            matrix[i][j] = fill;
        }
    }
}

export function multiplyClassic(matrixA, matrixB) {
    let n = matrixA.length;
    let m = matrixB[0].length;
    let q = matrixB.length;
    let res = [];
    createMatrix(res, n, m, 0);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            for (let k = 0; k < q; k++) {
                res[i][j] = res[i][j] + matrixA[i][k] * matrixB[k][j];
            }
        }
    }

    return res;
}

export function multiplyVin(matrixA, matrixB) {
    let n = matrixA.length;
    let m = matrixB[0].length;
    let q = matrixB.length;
    let res = [];
    createMatrix(res, n, m, 0);
    let mulH = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        for (let k = 0; k < Math.floor(q / 2); k++) {
            mulH[i] = mulH[i] + matrixA[i][2 * k] * matrixA[i][2 * k + 1];
        }
    }
    let mulV = new Array(m).fill(0);
    for (let i = 0; i < m; i++) {
        for (let k = 0; k < Math.floor(q / 2); k++) {
            mulV[i] = mulV[i] + matrixB[2 * k][i] * matrixB[2 * k + 1][i];
        }
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            res[i][j] = -mulH[i] - mulV[j];
            for (let k = 0; k < Math.floor(q / 2); k++) {
                res[i][j] = res[i][j] + (matrixA[i][2 * k] + matrixB[2 * k + 1][j]) * (matrixA[i][2 * k + 1] + matrixB[2 * k][j]);
            }
        }
    }
    if (q % 2 === 1) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                res[i][j] = res[i][j] + matrixA[i][q-1] * matrixB[q-1][j];
            }
        }
    }

    return res;
}

export function multiplyVinOpt(matrixA, matrixB) {
    let n = matrixA.length;
    let m = matrixB[0].length;
    let q = matrixB.length;
    let res = [];
    let middle = Math.floor(q / 2);
    createMatrix(res, n, m, 0);
    let mulH = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        for (let k = 0; k < middle; k++) {
            mulH[i] += matrixA[i][k << 1] * matrixA[i][(k << 1) + 1];
        }
    }
    let mulV = new Array(m).fill(0);
    for (let i = 0; i < m; i++) {
        for (let k = 0; k < middle; k++) {
            mulV[i] += matrixB[k << 1][i] * matrixB[(k << 1) + 1][i];
        }
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            res[i][j] = -mulH[i] - mulV[j];
            for (let k = 0; k < middle; k++) {
                res[i][j] += (matrixA[i][k << 1] + matrixB[(k << 1) + 1][j]) * (matrixA[i][(k << 1) + 1] + matrixB[k << 1][j]);
            }
        }
    }
    if (q % 2 === 1) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                res[i][j] += matrixA[i][q-1] * matrixB[q-1][j];
            }
        }
    }

    return res;
}
