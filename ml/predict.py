import joblib

# Load saved model
model = joblib.load("ml/sentiment_model.pkl")

# Load saved vectorizer
vectorizer = joblib.load("ml/tfidf_vectorizer.pkl")

# New sentence
new_text = ["I really love this product"]

# Convert text into numbers
new_text_tfidf = vectorizer.transform(new_text)

# Prediction
result = model.predict(new_text_tfidf)

print("Sentiment:", result[0])