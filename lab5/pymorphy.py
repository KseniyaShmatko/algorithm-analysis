import pymorphy2
import sys

def analyze_word(word):
    morph = pymorphy2.MorphAnalyzer()
    parsed = morph.parse(word)
    hypotheses = []
    for p in parsed:
        hypotheses.append(p.tag)

    return hypotheses

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Неверный формат запуска")
        sys.exit(1)
    word = sys.argv[1]
    hypotheses = analyze_word(word)
    print(hypotheses)