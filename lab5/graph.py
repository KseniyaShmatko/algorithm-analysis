import csv
import matplotlib.pyplot as plt

file_name = 'time.csv'
data = {'count': [], 'time': []}

with open(file_name, newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        data['count'].append(int(row['count']))
        data['time'].append(float(row['time']))

plt.figure(figsize=(10, 5))

plt.plot(data['count'], data['time'], marker='o')

plt.xlabel('Количество заявок')
plt.ylabel('Время, с')
plt.title('Зависимость времени от количества заявок')
plt.grid()
plt.show()

# Сохраняем график в файл PDF
plt.savefig('graph.pdf', format='pdf')
