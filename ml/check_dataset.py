import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

from preprocess import preprocess_text


# 1. Dataset load
data = pd.read_csv(
    "data/amazon_cells_labelled.txt",
    sep="\t",
    header=None,
    names=["text", "sentiment"]
)


# 2. Convert labels
data["sentiment"] = data["sentiment"].map({
    0: "negative",
    1: "positive"
})


# 3. Preprocessing
data["text"] = data["text"].apply(preprocess_text)


# 4. Input and output
X = data["text"]
y = data["sentiment"]


# 5. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# 6. TF-IDF
vectorizer = TfidfVectorizer(ngram_range=(1,2))

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)


# 7. Logistic Regression
model = LogisticRegression(C=10)

model.fit(X_train_tfidf, y_train)


# 8. Save model and vectorizer
joblib.dump(model, "ml/sentiment_model.pkl")
joblib.dump(vectorizer, "ml/tfidf_vectorizer.pkl")


# 9. Prediction
predictions = model.predict(X_test_tfidf)


# 10. Accuracy
accuracy = accuracy_score(y_test, predictions)

print("\nAccuracy:", accuracy)


# 11. Confusion Matrix
cm = confusion_matrix(y_test, predictions)

print("\nConfusion Matrix:")
print(cm)


# 12. Classification Report
print("\nClassification Report:")
print(classification_report(y_test, predictions))