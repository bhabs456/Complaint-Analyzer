import pandas as pd
import pickle

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report


# =========================
# LOAD DATA
# =========================
df = pd.read_csv("../datasets/complaints_data.csv")

# remove nulls
df = df.dropna()

# remove uncertain if exists
df = df[df["category"] != "uncertain"]

print("📊 Dataset Distribution:\n")
print(df["category"].value_counts())


# =========================
# PREPROCESS FUNCTION
# =========================
def preprocess(text):
    text = str(text).lower()
    return text


df["description"] = df["description"].apply(preprocess)


# =========================
# SPLIT DATA (IMPORTANT)
# =========================
X = df["description"]
y = df["category"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y   # 🔥 IMPORTANT
)


# =========================
# VECTORIZATION (UPGRADED)
# =========================
vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),   # 🔥 BIGRAM SUPPORT
    max_features=5000     # limit noise
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)


# =========================
# MODEL (BALANCED)
# =========================
model = LogisticRegression(
    max_iter=300,
    class_weight='balanced'   # 🔥 handles imbalance
)

model.fit(X_train_vec, y_train)


# =========================
# EVALUATION
# =========================
preds = model.predict(X_test_vec)

accuracy = accuracy_score(y_test, preds)

print("\n🎯 Accuracy:", round(accuracy, 4))
print("\n📊 Classification Report:\n")
print(classification_report(y_test, preds))


# =========================
# SAVE MODEL
# =========================
pickle.dump(model, open("../ml_models/model.pkl", "wb"))
pickle.dump(vectorizer, open("../ml_models/vectorizer.pkl", "wb"))

print("\n✅ Model saved successfully")


# =========================
# QUICK MANUAL TEST
# =========================
print("\n🧪 Sample Predictions:\n")

sample_tests = [
    "water overflowing from drain near road",
    "streetlight not working at night",
    "garbage burning causing smoke",
    "power cut in entire area",
    "heavy traffic jam at intersection"
]

for text in sample_tests:
    vec = vectorizer.transform([text])
    pred = model.predict(vec)[0]
    print(f"{text} → {pred}")