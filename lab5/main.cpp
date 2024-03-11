#include <iostream>
#include <fstream>
#include <cstdlib>
#include <cstdio>
#include <vector>
#include <string>
#include <thread>
#include <queue>
#include <mutex>
#include <algorithm>
#include <chrono>
#include <numeric>

struct Request {
    int id;
    std::string file_path;
    std::vector<std::string> words;
    std::vector<std::string> hypotheses;
    std::chrono::time_point<std::chrono::high_resolution_clock> t1_start, t1_end, t2_start, t2_end, t3_start, t3_end;
};

struct Log {
    int id;
    int request_id;
    int type;
    std::chrono::time_point<std::chrono::high_resolution_clock> time;
    bool operator<(const Log& other) const {
        return time < other.time;
    }
};

std::mutex mutex1;
std::mutex mutex2;
std::mutex mutex3;

std::string pymorphy(const char* inputWord, const char* pyScript) {
    char line[100];
    sprintf(line, "python3 %s %s", pyScript, inputWord);

    FILE* pipe = popen(line, "r");
    if (!pipe) {
        std::cerr << "Ошибка с вызовом python" << std::endl;
        exit(EXIT_FAILURE);
    }

    char res[1000];
    fgets(res, sizeof(res), pipe);
    pclose(pipe);

    return std::string(res);
}

void handler1(std::queue<Request>& inputQueue, std::queue<Request>& outputQueue) {
    while (true) {

        while (inputQueue.empty());

        Request request = inputQueue.front();
        inputQueue.pop();

        if (request.id == -1) {
            outputQueue.push(request);
            break;
        }

        request.t1_start = std::chrono::high_resolution_clock::now();

        std::ifstream file(request.file_path);
        if (!file.is_open()) {
            exit(EXIT_FAILURE);
        }

        std::string word;
        while (file >> word) {
            request.words.push_back(word);
        }

        file.close();

        request.t1_end = std::chrono::high_resolution_clock::now();
        std::unique_lock<std::mutex> lock2(mutex2);
        outputQueue.push(request);
        lock2.unlock();
    }
}

void handler2(std::queue<Request>& inputQueue, std::queue<Request>& outputQueue) {
    while (true) {
        while (inputQueue.empty());
        std::unique_lock<std::mutex> lock2(mutex2);

        Request request = inputQueue.front();
        inputQueue.pop();

        lock2.unlock();

        if (request.id == -1) {
            outputQueue.push(request);
            break;
        }

        request.t2_start = std::chrono::high_resolution_clock::now();

        for (const auto& word : request.words) {
            std::string hypothes = pymorphy(word.c_str(), "pymorphy.py");
            request.hypotheses.push_back(hypothes);
        }

        request.t2_end = std::chrono::high_resolution_clock::now();

        std::unique_lock<std::mutex> lock3(mutex3);
        outputQueue.push(request);
        lock3.unlock();
    }
}

void handler3(std::queue<Request>& inputQueue, std::vector<Request>& pool) {
    while (true) {
        while (inputQueue.empty());

        std::unique_lock<std::mutex> lock3(mutex3);
        Request request = inputQueue.front();

        inputQueue.pop();
        lock3.unlock();

        if (request.id == -1) break;

        request.t3_start = std::chrono::high_resolution_clock::now();

        std::string output_file_path = "./output" + std::to_string(request.id) + ".txt";
        std::ofstream output_file(output_file_path);

        if (!output_file.is_open()) {
            exit(EXIT_FAILURE);
        }

        for (const auto& hypothes : request.hypotheses) {
            output_file << hypothes << std::endl;
        }
        output_file.close();
        request.t3_end = std::chrono::high_resolution_clock::now();
        pool[request.id] = request;
    }
}

void createLog(const std::vector<Request>& pool) {
    std::vector<Log> logs;
    for (const auto& request : pool) {
        logs.push_back({1, request.id, 1, request.t1_start});
        logs.push_back({1, request.id, 0, request.t1_end});
        logs.push_back({2, request.id, 1, request.t2_start});
        logs.push_back({2, request.id, 0, request.t2_end});
        logs.push_back({3, request.id, 1, request.t3_start});
        logs.push_back({3, request.id, 0, request.t3_end});
    }

    std::sort(logs.begin(), logs.end());

    for (const auto& log : logs) {
        std::string message = log.type ? " начал" : " закончил";
        std::cout << log.id << message << " работать с " << log.request_id << " заявкой " << "("<< std::chrono::duration_cast<std::chrono::nanoseconds>(log.time.time_since_epoch()).count() <<")" << std::endl;
    }
}

    int pipeline(int number_of_files, std::string file_path, std::vector<Request>& pool) {
        std::queue<Request> inputQueue;
        std::queue<Request> pythonQueue;
        std::queue<Request> outputQueue;

        for (int i = 0; i < number_of_files; i++) {
            Request request;
            request.id = i;
            request.file_path = file_path;
            inputQueue.push(request);
        }

        Request terminationRequest;
        terminationRequest.id = -1;
        inputQueue.push(terminationRequest);

        std::thread t1(handler1, std::ref(inputQueue), std::ref(pythonQueue));
        std::thread t2(handler2, std::ref(pythonQueue), std::ref(outputQueue));
        std::thread t3(handler3, std::ref(outputQueue), std::ref(pool));

        t1.join();
        t2.join();
        t3.join();

        createLog(pool);

        return 0;
    }

    double avg(std::vector<long long> const& v) {
        return 1.0 * std::accumulate(v.begin(), v.end(), 0LL) / v.size();
    }

    int test () {
        std::vector<int> fileCounts = {1, 2, 3, 4, 5};
        std::string file_path = "data/input.txt";

        std::ofstream csvTimeFile("time.csv");
        csvTimeFile << "count,time" << std::endl;

        std::ofstream csvAllTimeFile("all.csv");
        csvAllTimeFile << "count,tmin,tavg,tmax,t2,t3,tall" << std::endl;

        std::vector<double> executionTimes;
        for (int i = 0; i < fileCounts.size(); i++) {
            auto start = std::chrono::high_resolution_clock::now();
            std::vector<Request> pool(fileCounts[i]);
            
            pipeline(fileCounts[i], file_path, pool);

            auto end = std::chrono::high_resolution_clock::now();
            std::chrono::duration<double> duration = end - start;
            double timeInSeconds = duration.count();

            executionTimes.push_back(timeInSeconds);
            csvTimeFile << fileCounts[i] << "," << timeInSeconds << std::endl;

            std::vector<long long> times, t2, t3, tall;
            for (auto el : pool) {
                times.push_back(std::chrono::duration_cast<std::chrono::milliseconds>(el.t1_end.time_since_epoch() - el.t1_start.time_since_epoch()).count());
                times.push_back(std::chrono::duration_cast<std::chrono::milliseconds>(el.t2_end.time_since_epoch() - el.t2_start.time_since_epoch()).count());
                times.push_back(std::chrono::duration_cast<std::chrono::milliseconds>(el.t3_end.time_since_epoch() - el.t3_start.time_since_epoch()).count());
                t2.push_back(std::chrono::duration_cast<std::chrono::milliseconds>(el.t2_end.time_since_epoch() - el.t2_start.time_since_epoch()).count());
                t3.push_back(std::chrono::duration_cast<std::chrono::milliseconds>(el.t3_end.time_since_epoch() - el.t3_start.time_since_epoch()).count());
                tall.push_back(std::chrono::duration_cast<std::chrono::milliseconds>(el.t3_end.time_since_epoch() - el.t1_start.time_since_epoch()).count());
            }
            csvAllTimeFile << i << "," << *(std::min_element(times.begin(), times.end())) << "," << avg(times) << "," << *(std::max_element(times.begin(), times.end())) << "," << avg(t2) << "," << avg(t3) << "," << avg(tall) << std::endl;
        }

        std::cout << "Графики построены." << std::endl;
        return 0;
    }

    int main() {
        int choice;
        int number_of_files = 3;
        std::string file_path = "data/input.txt";
        std::cout << "Меню:\n";
        std::cout << "1. Запустить конвейер\n";
        std::cout << "2. Замерить время\n";
        std::cout << "0. Выйти\n";

        std::cout << "Введите номер: ";
        std::cin >> choice;
        int res;
        std::vector<Request> pool(number_of_files);
        switch (choice) {
            case 1:
                res = pipeline(number_of_files, file_path, pool);
                break;
            case 2:
                res = test();
                break;
            case 0:
                std::cout << "Программа завершена.\n";
                break;
            default:
                std::cout << "Неверный ввод.\n";
                break;
        }

        return 0;

    }
