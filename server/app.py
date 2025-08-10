from flask import Flask, request, jsonify
from joblib import load

app = Flask(__name__)
svm_model = load('svm_model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_data = data['input_data']

    predictions = svm_model.predict(vectorizer.transform(input_data))

    return jsonify({'predictions': predictions.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
