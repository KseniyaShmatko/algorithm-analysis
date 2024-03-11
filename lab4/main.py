import pymorphy2
import threading
import time
import statistics
import csv
from file import * 

COUNT = 4

def no_threads_mode_time(text):
    words = text.split()
    time_arr = []
    for i in range (COUNT):
        output = []
        start_time = time.time_ns() 
        analyze_words(output, words)
        end_time = time.time_ns() 
        time_arr.append(end_time - start_time)
    average = statistics.mean(time_arr)
    return average

def with_threads_mode_test(text, n):
    words_arr = split_words(text.split(), n)
    time_arr = []

    for i in range (COUNT):
        res = [[] for _ in range(n)]
        threads = []
        start_time = time.time_ns() 
        for i, words in enumerate(words_arr):
            thread = threading.Thread(target=analyze_words, args=(res[i], words))
            threads.append(thread) 

        # Запуск всех потоков
        for thread in threads:
            thread.start()

        # Ожидание завершения всех потоков
        for thread in threads:
            thread.join()
        end_time = time.time_ns() 
        time_arr.append(end_time - start_time)
    
    average = statistics.mean(time_arr)
    return average

# Функция для анализа слов с помощью pymorphy2
def analyze_words(hypotheses, words):
    morph = pymorphy2.MorphAnalyzer()
    for word in words:
        parsed = morph.parse(word)
        hypotheses.append([word, [p.tag for p in parsed]])

# Функция для запуска без потоков
def no_threads_mode(text, file_name):
    words = text.split()
    output = []
    analyze_words(output, words)
    write_to_file(output, file_name)

# Функция для запуска с потоками
def with_threads_mode(text, file_name, n):
    words_arr = split_words(text.split(), n)
    res = [[] for _ in range(n)]
    threads = []
    for i, words in enumerate(words_arr):
        thread = threading.Thread(target=analyze_words, args=(res[i], words))
        threads.append(thread)

    # Запуск всех потоков
    for thread in threads:
        thread.start()

    # Ожидание завершения всех потоков
    for thread in threads:
        thread.join()

    output = sum(res, [])
    write_to_file(output, file_name)

def time_test():
    files = ["data/input100.txt", "data/input200.txt", "data/input300.txt", "data/input400.txt", "data/input500.txt"]
    n_threads = [0, 1, 2, 4, 8, 16, 32, 64]
    res = [[0 for _ in range(len(n_threads))] for _ in range(len(files))]
    for i, file in enumerate(files):
        input_data = read_text(file)
        for j, n in enumerate(n_threads):
            if n == 0:
                res[i][j] = no_threads_mode_time(input_data)
            else:
                res[i][j] = with_threads_mode_test(input_data, n)
            print(file, n)

    header = ["size", "0", "1", "2", "4", "8", "16", "32", "64"]
    with open('data/output.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(header)
        size = 100
        for i in range(len(res)):
            row = [f"{size}"] + res[i]
            writer.writerow(row)
            size += 100


def start():
    print("1. Режим без вспомогательных потоков")
    print("2. Многопоточный режим")
    print("3. Режим замеров")
    mode = int(input("Выберите режим: "))
    if (mode == 1):
        name = input("Введите название файла с расширением: ")
        input_data = []
        try:
            input_data = read_text(name)
        except:
            print("Ошибка при чтении файла")
        else:
            no_threads_mode(input_data, 'no_thread.txt')
    elif (mode == 2):
        name = input("Введите название файла с расширением: ")
        input_data = []
        try:
            input_data = read_text(name)
        except:
            print("Ошибка при чтении файла")
        else:
            n = int(input("Введите количество потоков: "))
            if(n >= 1 and n <= 64):
                with_threads_mode(input_data, 'threadn.txt', n)
            else:
                print("Ошибка: неверное количество потоков")
    elif (mode == 3):
        time_test()
    else:
        print("Ошибка: неверный режим")

start()
