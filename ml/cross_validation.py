import pandas as pd

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

from preprocess import preprocess_text


# 1. Dataset load
data = pd.read_csv(
    "data/amazon_cells_labelled.txt",
    sep="\t",
    header=None,
    names=["text", "sentiment"]
)


# 2. Labels convert
data["sentiment"] = data["sentiment"].map({
    0: "negative",
    1: "positive"
})


# 3. Preprocessing
data["text"] = data["text"].apply(preprocess_text)


# 4. Input and output
X = data["text"]
y = data["sentiment"]


# 5. TF-IDF + Logistic Regression
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
    ("model", LogisticRegression(C=10))
])


# 6. 5-Fold Cross Validation
scores = cross_val_score(
    pipeline,
    X,
    y,
    cv=5,
    scoring="accuracy"
)


print("Fold Accuracies:")
print(scores)

print("\nMean Accuracy:")
print(scores.mean())