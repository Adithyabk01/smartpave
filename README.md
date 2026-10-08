# 🛣️ SmartPave – AI-Based Pavement Maintenance Optimization

> **Tagline:** Smarter Roads | Better Decisions | Longer Life  
> **Project Context:** Civil Engineering AI/ML Decision Support System for **NH-275 (Mysuru, Karnataka)** Corridor

---

## 📌 Executive Overview
**SmartPave** is a production-quality academic web application prototype designed to automate Pavement Condition Index (**PCI**) evaluation, predict pavement degradation using **scikit-learn Random Forest Regression**, and optimize maintenance interventions via **Life-Cycle Cost (LCC)** present-value economic analysis.

The system utilizes the exact 12-section dataset (`S1` to `S12`) extracted from `ml.xlsx`.

---

## 🏗️ Architecture & Technology Stack

```text
smartpave/
├── backend/                  # Python FastAPI & scikit-learn ML Engine
│   ├── app/
│   │   ├── main.py           # FastAPI CORS App & Entry Point
│   │   ├── api/              # REST Endpoints
│   │   ├── ml/               # Random Forest Model & Dynamic Feature Importance
│   │   ├── services/         # Data Loader, LCC Calculator, Maintenance Screening
│   │   └── schemas/          # Pydantic Schemas
│   ├── requirements.txt      # Backend Python Dependencies
│   └── run.py                # Server Runner script
├── frontend/                 # React + TypeScript + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/       # Controls, KPI Cards, Parameters Box, Charts, SectionTable
│   │   ├── pages/            # Dashboard, AI Prediction, Summary, LCC, Future PCI, Viva Report
│   │   ├── services/         # Axios API Client & Local Fallback Data
│   │   ├── types/            # TypeScript Interfaces
│   │   └── App.tsx           # Main App Routing
│   ├── package.json
│   └── vite.config.ts
├── data/
│   ├── ml.xlsx               # Source Dataset (12 Sections S1–S12)
│   └── ml.csv
└── README.md                 # Setup & Run Guide
```

### Stack Components
* **Frontend:** Vite, React 19, TypeScript, Tailwind CSS, Lucide React Icons, Recharts
* **Backend:** FastAPI, Python 3.13, Pandas, NumPy, scikit-learn (`RandomForestRegressor`), openpyxl
* **ML Model Config:** `n_estimators=300`, `max_depth=4`, `random_state=42`, `SimpleImputer(strategy='median')`

---

## 🚀 Execution Instructions

### 1. Start the FastAPI Backend Server
Open a terminal in `smartpave/backend` and run:

```bash
cd smartpave/backend
python run.py
```
* **Backend API Base URL:** `http://localhost:8000/api`
* **Swagger API Documentation:** `http://localhost:8000/docs`

### 2. Start the React Frontend Application
Open another terminal in `smartpave/frontend` and run:

```bash
cd smartpave/frontend
npm install
npm run dev
```
* **Frontend Application URL:** `http://localhost:5173`

---

## 💡 Key Application Features

1. **Executive Dashboard:**
   * Interactive Section Filter (`S1` through `S12`) for road corridor **NH-275**.
   * KPI Scorecards for **CURRENT PCI**, **PREDICTED PCI**, **CONDITION**, and **RECOMMENDED ACTION**.
   * Pavement Parameters Box displaying Age, IRI, RI, Rutting, Texture, and total Area ($m^2$).
   * PCI Trend line chart and Actual vs. Predicted PCI comparison chart.
   * Section-wise summary table with condition badges and search/sorting capabilities.

2. **AI / ML Model Diagnostic Page:**
   * Random Forest architecture parameters and input/target definitions.
   * Dynamic **Feature Importance** bar chart computed directly from `model.feature_importances_`.
   * Model evaluation metrics ($R^2$, MAE, RMSE) with clear academic small dataset disclaimer.

3. **Maintenance & Optimization Page:**
   * Rule-based intervention matrix (Preventive Maintenance, Overlay, Rehabilitation, Reconstruction).
   * Priority categorization and active section condition triggers.

4. **Illustrative Future PCI Scenario:**
   * Interactive simulation sliders for forecast horizon, annual PCI decline rate, and minimum trigger threshold.

5. **Life-Cycle Cost (LCC) Analysis:**
   * Financial present-value formula: $PV = \frac{\text{Cost}}{(1 + r)^t}$.
   * Strategy comparison matrix highlighting lowest-cost vs. recommended optimal intervention.

6. **Dataset Validator & Uploader:**
   * Support for `.xlsx` and `.csv` drag-and-drop file upload with column schema check.

7. **Viva Presentation Report View:**
   * Print-ready summary report formatted for academic project viva defense and PDF export.

---

## 🎓 Academic Integrity Disclaimer
* **Measured Data:** Directly sourced from `ml.xlsx` (Sections S1–S12).
* **ML Prediction:** Derived from scikit-learn Random Forest model fit.
* **Feature Importance:** Extracted dynamically from `model.feature_importances_`.
* **Future PCI:** Labeled as an *illustrative scenario*, not a calibrated empirical deterioration model.
