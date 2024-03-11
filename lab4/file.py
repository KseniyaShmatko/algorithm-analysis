# Функция для чтения текста из файла
def read_text(file_name):
    with open(file_name, 'r', encoding='utf-8') as file:
        text = file.read()
    return text

# Функция для записи результата в файл
def write_to_file(data, file_name):
    with open(file_name, 'w', encoding='utf-8') as file:
        for word in data:
            file.write(f'{word}\n')

# Функция для разбиения слов файла на массивы
def split_words(text, n):
    word_lists = [[] for _ in range(n)]
    for i, word in enumerate(text):
        index = i % n
        word_lists[index].append(word)
    return word_lists
