import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import pickle
import os

# Load raw logs
log_path = os.path.join(os.path.dirname(__file__), 'logs', 'sample_logs.csv')
df = pd.read_csv(log_path, parse_dates=['timestamp'])

# Feature engineering per log (not group-by)
df['hour'] = df['timestamp'].dt.hour
df['is_suspicious_agent'] = df['user_agent'].apply(lambda x: int('curl' in x.lower() or 'python' in x.lower()))
df['failed_login'] = df['status_code'].apply(lambda x: int(x >= 400))

# Select per-event features
X = df[['failed_login', 'is_suspicious_agent', 'hour']]

# Train model on raw event-level features
model = IsolationForest(n_estimators=100, contamination=0.15, random_state=42)
model.fit(X)

# Save model
model_dir = os.path.join(os.path.dirname(__file__), 'model')
os.makedirs(model_dir, exist_ok=True)
model_path = os.path.join(model_dir, 'isolation_forest.pkl')
with open(model_path, 'wb') as f:
    pickle.dump(model, f)

print(f"✅ Trained Isolation Forest on {len(X)} events and saved to {model_path}")

