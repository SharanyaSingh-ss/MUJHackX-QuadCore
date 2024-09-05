from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
import numpy as np

app = Flask(__name__)

# Load dataset
df = pd.read_csv('data/scooter_data.csv')

# Preprocess data
df = pd.get_dummies(df, columns=['primary_use', 'usage_duration', 'size_weight'])

# Define features and target variable
X = df.drop('recommendation', axis=1)
y = df['recommendation']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train the Decision Tree Classifier
clf = DecisionTreeClassifier()
clf.fit(X_train, y_train)

# Function to make top 3 recommendations
def recommend_top3_scooters(budget, primary_use, usage_duration, size_weight):
    input_data = {
        'budget': [budget],
        'primary_use_city': [1 if primary_use == 'city' else 0],
        'primary_use_offroad': [1 if primary_use == 'offroad' else 0],
        'usage_duration_short': [1 if usage_duration == 'short' else 0],
        'usage_duration_long': [1 if usage_duration == 'long' else 0],
        'size_weight_small': [1 if size_weight == 'small' else 0],
        'size_weight_medium': [1 if size_weight == 'medium' else 0],
        'size_weight_large': [1 if size_weight == 'large' else 0]
    }
    input_df = pd.DataFrame(input_data)
    input_df = input_df.reindex(columns=X_train.columns, fill_value=0)
    probabilities = clf.predict_proba(input_df)
    top_3_indices = np.argsort(probabilities[0])[-3:][::-1]
    top_3_recommendations = clf.classes_[top_3_indices]
    return top_3_recommendations

# Serve the HTML frontend
@app.route('/')
def home():
    return render_template('index.html')

# Flask API endpoint to get recommendations
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    budget = data['budget']
    primary_use = data['primary_use']
    usage_duration = data['usage_duration']
    size_weight = data['size_weight']

    recommendations = recommend_top3_scooters(budget, primary_use, usage_duration, size_weight)
    return jsonify(recommendations.tolist())

if __name__ == '__main__':
    app.run(debug=True)
