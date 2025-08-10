# predict.py
import sys
import json
import joblib
clf = joblib.load('random_forest_model.joblib')
data = json.loads(sys.stdin.readline())
features = data['features']

predictions = clf.predict([features])
print(predictions)
print(json.dumps({'predictions': predictions.tolist()}))
print("Hello World")
