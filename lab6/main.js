const { parseFullCombinations, parseAntAlg, updateFile } = require('./file.js'); 
const { parametrization, testTime } = require('./test.js');
const prompt = require('prompt-sync')();

function main() {
    let choice = -1;
    let menu = "Меню\n\
    1. Полный перебор \n\
    2. Муравьиный алгоритм \n\
    3. Параметризация \n\
    4. Замерить время \n\
    5. Обновить данные \n\
    0. Выход \n\ ";
    while(choice !== 0) {
        console.log(menu)
        choice = +prompt("Введите номер: ");
        switch (choice) {
            case 1:
                parseFullCombinations();
                break;
            case 2:
                parseAntAlg();
                break;
            case 3:
                parametrization();
                break;
            case 4:
                testTime();
                break;
            case 5:
                updateFile();
                break;
            case 0:
                return;
                break;
            default:
                console.log("Неверный ввод");
                break;
        }
    }
}

main();
