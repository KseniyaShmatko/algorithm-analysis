const { fullSearch, binarySearch } = require('./algorithms.js');
const { inputArray, inputNumber, timeTest } = require('./test.js'); 
const prompt = require('prompt-sync')();

function main() {
    let choice = -1;
    let menu = "Меню\n\
    1. Стандартный алгоритм \n\
    2. Бинарный поиск \n\
    3. Замерить время \n\
    0. Выход \n\ ";
    while(choice !== 0) {
        console.log(menu)
        choice = +prompt("Введите номер: ");
        let input;
        let number;
        let answer;
        switch (choice) {
            case 1:
                input = inputArray();
                if(input === false) {
                    console.log("Неверный ввод массива");
                    return;
                }
                number = inputNumber();
                if(number === false) {
                    console.log("Неверный ввод числа");
                    return;
                }
                answer = fullSearch(input, number);
                console.log("Индекс искомого элемента: ", answer);
                break;
            case 2:
                input = inputArray();
                if(input === false) {
                    console.log("Неверный ввод массива");
                    return;
                }
                number = inputNumber();
                if(number === false) {
                    console.log("Неверный ввод числа");
                    return;
                }
                answer = binarySearch(input, number);
                console.log("Индекс искомого элемента: ", answer);
                break;
            case 3:
                timeTest();
                break;
            case 0:
                return;
            default:
                console.log("Неверный ввод");
                break;
        }
    }
}

main();
