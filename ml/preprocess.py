import re
import nltk

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download("stopwords")
nltk.download("wordnet")
nltk.download("omw-1.4")

lemmatizer = WordNetLemmatizer()
# stop_words = set(stopwords.words("english"))

stop_words = set(stopwords.words("english"))

# Sentiment ke liye important words ko remove nahi karenge
important_words = {"not", "no", "never"}

stop_words = stop_words - important_words

def preprocess_text(text):

    # 1. Lowercase
    text = text.lower()

    # 2. Remove punctuation
    text = re.sub(r"[^a-zA-Z\s]", "", text)

    # 3. Split into words
    words = text.split()

    # 4. Remove stopwords
    words = [
        word for word in words
        if word not in stop_words
    ]

    # 5. Lemmatization
    words = [
        lemmatizer.lemmatize(word)
        for word in words
    ]

    # 6. Join words back
    text = " ".join(words)

    return text


text = "I am REALLY loving this amazing product!!!"

clean_text = preprocess_text(text)

print("Original:")
print(text)

print("\nCleaned:")
print(clean_text)