import json
import pickle
import pandas as pd
import os

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), 'model', 'isolation_forest.pkl')
with open(model_path, 'rb') as f:
    model = pickle.load(f)

# Rule-based fallback for known bad behavior
def rule_based_check(event):
    status_code = int(event.get("status_code", 0))
    user_agent = event.get("user_agent", "").lower()
    if status_code >= 400 and any(keyword in user_agent for keyword in ["curl", "python", "urllib", "requests"]):
        return "anomaly"
    return "normal"

# Extract ML features
def extract_features(event):
    timestamp = pd.to_datetime(event.get("timestamp"))
    hour = timestamp.hour
    status_code = int(event.get("status_code", 0))
    user_agent = event.get("user_agent", "").lower()

    is_suspicious_agent = int("curl" in user_agent or "python" in user_agent)
    failed_login = int(status_code >= 400)

    features = pd.DataFrame([{
        "failed_login": failed_login,
        "is_suspicious_agent": is_suspicious_agent,
        "hour": hour
    }])

    return features

# Combined Lambda handler
def lambda_handler(event, context=None):
    try:
        # Step 1: Rule-based detection
        if rule_based_check(event) == "anomaly":
            result = "anomaly (rule-based)"
        else:
            # Step 2: ML-based detection
            features = extract_features(event)
            prediction = model.predict(features)[0]
            result = "anomaly" if prediction == -1 else "normal"

        return {
            "statusCode": 200,
            "body": json.dumps({
                "ip_address": event.get("ip_address"),
                "result": result
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

# Local test
if __name__ == "__main__":
    test_event = {
        "timestamp": "2025-06-20 10:00:10",
        "ip_address": "10.0.0.1",
        "status_code": 403,
        "user_agent": "curl/7.68.0"
    }

    features = extract_features(test_event)
    print("🧪 Extracted Features:")
    print(features)

    response = lambda_handler(test_event)
    print("🔍 Lambda Response:")
    print(json.dumps(json.loads(response["body"]), indent=2))
