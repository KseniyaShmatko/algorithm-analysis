import csv
import matplotlib.pyplot as plt

# Чтение данных из файла CSV
file_name = 'data/output.csv'
data = {'size': [], '0': [], '1': [], '2': [], '4': [], '8': [], '16': [], '32': [], '64': []}

with open(file_name, newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        data['size'].append(int(row['size']))
        for key in data.keys():
            if key != 'size':
                value = row.get(key)
                if value is not None:
                    data[key].append(float(value))
                else:
                    data[key].append(0)

# Построение графика
plt.figure(figsize=(10, 5))

mark = ['o', '*', 'x', '.', '+', '|', 'd', 'v']
i = 0
for key in data.keys():
    if key != 'size':
        plt.plot(data['size'], data[key], marker=mark[i], label=f'{key} threads')
        i += 1

plt.xlabel('Размер файла, Кб')
plt.ylabel('Время, нс')
plt.title('Зависимость времени от количества потоков')
plt.legend()
plt.grid()
plt.semilogy()
plt.show()

# Сохраняем график в файл SVG
plt.savefig('graph1.pdf', format='pdf')

plt.figure(figsize=(10, 5))

i = 0
for key in data.keys():
    if i == 2:
        break
    if key != 'size':
        plt.plot(data['size'], data[key], marker=mark[i], label=f'{key} threads')
        i += 1

plt.xlabel('Размер файла, Кб')
plt.ylabel('Время, нс')
plt.title('Сравнение последовательного и с одним потоком алгоритмов')
plt.legend()
plt.grid()
plt.semilogy()
plt.show()

# Сохраняем график в файл SVG
plt.savefig('graph2.pdf', format='pdf')