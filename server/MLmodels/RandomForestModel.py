import joblib
import sys
def load_model():
    model_path = 'random_forest_model.pkl'
    model = joblib.load(model_path)
    return model

if __name__ == "__main__":
    input_data = sys.argv[1]
    model = load_model()
    result = model.predict([input_data])
    print(result)
