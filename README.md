# AI Sentiment Analyzer

An AI-powered web application that analyzes text and classifies it as Positive or Negative using Natural Language Processing and Machine Learning.

## Features

- User registration and login
- JWT authentication
- Sentiment prediction
- Prediction confidence score
- User-specific prediction history
- MongoDB storage
- React dashboard

## Tech Stack

- React.js
- Node.js
- Express.js
- MongoDB
- Python
- Flask
- Scikit-learn
- NLTK
- TF-IDF
- Logistic Regression

## Project Workflow

```text
React Frontend
      |
Node.js / Express
      |
Flask ML API
      |
Text Preprocessing
      |
TF-IDF
      |
Logistic Regression
      |
Positive / Negative
      |
MongoDB History
```

## Machine Learning

The model uses TF-IDF for text feature extraction and Logistic Regression for sentiment classification.

The model was evaluated using 5-fold cross-validation and achieved a mean accuracy of 83.2% on the dataset.

## Project Structure

```text
AI-Sentiment-Analyzer/
├── app.py
├── backend/
├── frontend/
├── data/
├── ml/
├── .gitignore
└── README.md
```

## How to Run

### Start Flask API

```bash
python app.py
```

### Start Backend

```bash
cd backend
npm install
node server.js
```

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

## Security

- Password hashing using bcrypt
- JWT-based authentication
- Environment variables for sensitive information
- User-specific prediction history

## Future Improvements

- Larger and improved datasets
- Additional ML models
- Advanced NLP techniques
- Online deployment
- Better sentiment analytics

## Author

Arpita Shaw

B.Tech Computer Science and Engineering
