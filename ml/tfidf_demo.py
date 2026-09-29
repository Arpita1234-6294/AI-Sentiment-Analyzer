from sklearn.feature_extraction.text import TfidfVectorizer

# 2 simple sentences
documents = [
    "I love this product",
    "I hate this product"
]

# TF-IDF object
vectorizer = TfidfVectorizer()

# Text ko numbers me convert karna
tfidf_matrix = vectorizer.fit_transform(documents)

# Words/features
print("Words:")
print(vectorizer.get_feature_names_out())

# TF-IDF numbers
print("\nTF-IDF Matrix:")
print(tfidf_matrix.toarray())