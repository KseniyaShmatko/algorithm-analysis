const itertools = require('itertools');

let MIN_PHEROMONE = 0.01

function fullCombinationAlg(matrix, size) {
    const places = Array.from({ length: size }, (_, i) => i);
    const placesCombinations = [];

    for (const combination of itertools.permutations(places)) {
        const combArr = Array.from(combination);
        placesCombinations.push(combArr);
    }

    let minDist = Infinity;
    let bestWay;

    for (let i = 0; i < placesCombinations.length; i++) {
        placesCombinations[i].push(placesCombinations[i][0]);
        let curDist = 0;

        for (let j = 0; j < size; j++) {
            const startCity = placesCombinations[i][j];
            const endCity = placesCombinations[i][j + 1];
            curDist += matrix[startCity][endCity];
        }

        if (curDist < minDist) {
            minDist = curDist;
            bestWay = placesCombinations[i];
        }
    }

    console.log(minDist);
    return [minDist, bestWay];
}

function calcQ(matrix, size) {
    let q = 0;
    let count = 0;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (i !== j) {
                q += matrix[i][j];
                count++;
            }
        }
    }

    return q / count;
}

function calcPheromones(size) {
    const min_phero = 1;
    const pheromones = Array.from({ length: size }, () => Array(size).fill(min_phero));
    return pheromones;
}

function calcVisibility(matrix, size) {
    const visibility = Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => (i !== j ? 1.0 / matrix[i][j] : 0))
    );
    return visibility;
}

function calcVisitedPlaces(route, ants) {
    const visited = Array.from({ length: ants }, () => []);
    for (let ant = 0; ant < ants; ant++) {
        visited[ant].push(route[ant]);
    }
    return visited;
}

function calcLength(matrix, route) {
    let length = 0;

    for (let way_len = 1; way_len < route.length; way_len++) {
        length += matrix[route[way_len - 1]][route[way_len]];
    }

    return length;
}

function updatePheromones(matrix, places, visited, pheromones, q, k_evaporation) {
    const ants = places;

    for (let i = 0; i < places; i++) {
        for (let j = 0; j < places; j++) {
            let delta = 0;
            for (let ant = 0; ant < ants; ant++) {
                const length = calcLength(matrix, visited[ant]);
                delta += q / length;
            }

            pheromones[i][j] *= 1 - k_evaporation;
            pheromones[i][j] += delta;

            if (pheromones[i][j] < MIN_PHEROMONE) {
                pheromones[i][j] = MIN_PHEROMONE;
            }
        }
    }

    return pheromones;
}

function findWays(pheromones, visibility, visited, places, ant, alpha, beta) {
    const pk = Array(places).fill(0);

    for (let place = 0; place < places; place++) {
        if (!visited[ant].includes(place)) {
            const ant_place = visited[ant][visited[ant].length - 1];
            pk[place] = Math.pow(pheromones[ant_place][place], alpha) * Math.pow(visibility[ant_place][place], beta);
        } else {
            pk[place] = 0;
        }
    }

    const sum_pk = pk.reduce((sum, val) => sum + val, 0);

    for (let place = 0; place < places; place++) {
        pk[place] /= sum_pk;
    }

    return pk;
}

function chooseNextPlaceByPosibility(pk) {
    const posibility = Math.random();
    let choice = 0;
    let chosenPlace = 0;

    while (choice < posibility && chosenPlace < pk.length) {
        choice += pk[chosenPlace];
        chosenPlace++;
    }

    return chosenPlace;
}

function antAlgorithm(matrix, places, alpha, beta, k_evaporation, days) {
    const q = calcQ(matrix, places);
    let bestWay = [];
    let minDist = Infinity;
    let pheromones = calcPheromones(places);
    const visibility = calcVisibility(matrix, places);
    const ants = places;

    for (let day = 0; day < days; day++) {
        const route = Array.from({ length: places }, (_, i) => i);
        const visited = calcVisitedPlaces(route, ants);

        for (let ant = 0; ant < ants; ant++) {
            while (visited[ant].length !== ants) {
                const pk = findWays(pheromones, visibility, visited, places, ant, alpha, beta);
                const chosenPlace = chooseNextPlaceByPosibility(pk);
                visited[ant].push(chosenPlace - 1);
            }

            visited[ant].push(visited[ant][0]);

            const curLength = calcLength(matrix, visited[ant]);

            if (curLength < minDist) {
                minDist = curLength;
                bestWay = visited[ant];
            }
        }

        pheromones = updatePheromones(matrix, places, visited, pheromones, q, k_evaporation);
    }
    console.log(minDist);
    return [minDist, bestWay];
}

module.exports = {
    fullCombinationAlg,
    antAlgorithm,
};