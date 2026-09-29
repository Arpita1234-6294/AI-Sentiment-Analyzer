from flask import Flask, request, jsonify
import joblib

from ml.preprocess import preprocess_text


app = Flask(__name__)


# Load saved model
model = joblib.load("ml/sentiment_model.pkl")


# Load saved vectorizer
vectorizer = joblib.load("ml/tfidf_vectorizer.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    text = data["text"]

    # Same preprocessing used during training
    clean_text = preprocess_text(text)

    # Convert cleaned text into TF-IDF
    text_tfidf = vectorizer.transform([clean_text])

    # Prediction
    result = model.predict(text_tfidf)

    # Prediction probability
    probability = model.predict_proba(text_tfidf)

    # Confidence
    confidence = max(probability[0]) * 100

    return jsonify({
        "text": text,
        "sentiment": result[0],
        "confidence": round(confidence, 2)
    })


@app.route("/")
def home():

    return "Sentiment Analysis API is running!"


if __name__ == "__main__":
    app.run(debug=True)