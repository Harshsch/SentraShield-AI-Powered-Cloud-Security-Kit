sentrashield/
├── README.md                          # Project overview and usage instructions
├── LICENSE                            # Open-source license (e.g., MIT or Apache 2.0)
│
├── modules/                           # Core functional modules
│   ├── anomaly-detector/              # ML-based log anomaly detection
│   │   ├── lambda_handler.py
│   │   ├── train_model.py
│   │   ├── model/
│   │   │   └── isolation_forest.pkl
│   │   ├── logs/
│   │   │   └── sample_logs.csv
│   │   ├── requirements.txt
│   │   └── cloudwatch_event.json
│   │
│   ├── vulnerability-scanner/         # Web vulnerability scanning engine
│   │   ├── scanner.py
│   │   └── test_urls.txt
│   │
│   └── input-validator/               # Web form security module
│       ├── index.html
│       ├── input-validator.js
│       └── firebase/
│           ├── index.js
│           └── firebase.json
│
├── core/                              # Infrastructure automation and DevSecOps
│   └── ci-cd/
│       ├── github-actions/
│       │   └── security-pipeline.yml  # GitHub Actions pipeline for automated security checks
│       └── terraform/                 # (Optional) IaC setup for cloud deployment
│           ├── main.tf
│           └── variables.tf
│
├── docs/                              # Documentation and research materials
│   ├── architecture-diagram.png       # System architecture or component flow
│   ├── research-outline.md            # Paper draft or journal write-up
│   └── patent-draft.md                # Initial outline for patent submission


# 🔐 SentraShield – AI-Powered Cloud Security Kit

> 🚀 Free-tier friendly · Serverless · Modular · AI-Powered

**SentraShield** is a modular, cloud-native cybersecurity toolkit designed to protect web applications and infrastructure through real-time anomaly detection, vulnerability scanning, and secure input validation — all deployable within free-tier cloud limits (AWS, GCP, Firebase).

---

## 🔍 Modules

### 1. `SentraShield-AD` – Log Anomaly Detector
- ✅ Unsupervised ML using Isolation Forest
- ✅ Deployed on AWS Lambda
- ✅ Monitors log streams for real-time anomalies

### 2. `SentraShield-VS` – Web Vulnerability Scanner
- ✅ Detects directory traversal, info leaks
- ✅ Python-based CLI or ZAP-based scanner
- ✅ Deployable on Google Cloud Run or local CLI

### 3. `SentraShield-IV` – Secure Input Validator
- ✅ Frontend JS sanitization (`DOMPurify`, `validator.js`)
- ✅ Firebase Functions for backend validation
- ✅ XSS, SQLi, code injection defenses

### 4. `SentraShield-Core` – CI/CD Integration
- ✅ GitHub Actions security checks
- ✅ Auto-detection triggers & rollback rules
- ✅ Optional Terraform setup for IaC

---

## 🧠 AI Component

- **Anomaly Detection:** Isolation Forest model trained on server logs
- **Optional AI Add-ons:** GPT/NLP for log explanation, VirusTotal API for URL classification

---

## 🧪 Project Goals

- [x] Use only free-tier cloud platforms
- [x] Be modular, so each component can run independently
- [x] Be publishable as research or launchable as a SaaS starter
- [x] Be practical for DevSecOps in real-world pipelines

---

## 📦 Getting Started

```bash
git clone https://github.com/harshchavan-dev/sentrashield.git
cd sentrashield/modules/anomaly-detector
python train_model.py
