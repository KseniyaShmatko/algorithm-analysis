function fullSearch(array, number) {
    for (let i = 0; i < array.length; i++) {
        if(array[i] == number) {
            return i;
        }
    }

    return -1;
}

function binarySearch(array, number) {
    let left = 0;
    let right = array.length -1;
    while(left <= right) {
        let mid = Math.floor((left + right)/2);
        let midVal = array[mid];
        if (midVal < number) {
            left = mid+1;
        }
        else if (midVal > number) {
            right = mid-1;
        }
        else {
            return mid;
        }
    }
    return -1;
}

module.exports = {
    fullSearch,
    binarySearch
};