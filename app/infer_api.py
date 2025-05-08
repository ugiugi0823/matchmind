# FastAPI 기반 슈팅 예측 API + HTML 테스트 페이지
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import math
from sklearn.preprocessing import StandardScaler

import os

app = FastAPI()

# 템플릿 디렉토리 지정
templates = Jinja2Templates(directory="app/templates")

# 모델 불러오기
model = joblib.load("app/best_model.pkl")
# 필요한 경우 scaler도 따로 저장한 경우 불러오기
# scaler = joblib.load("app/scaler.pkl")

# 거리 계산
def calculate_distance(x, y):
    return math.sqrt((x - 1.0)**2 + (y - 0.5)**2)

# 각도 계산
def calculate_angle(x, y, goal_y=0.5, goal_width=0.15):
    dy = abs(y - goal_y)
    dx = 1.0 - x
    return math.atan2(goal_width, math.sqrt(dx**2 + dy**2))

# 사용자 입력을 위한 HTML 폼 제공
@app.get("/", response_class=HTMLResponse)
async def serve_form(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# 입력 데이터 모델 정의
class ShotInput(BaseModel):
    x: float
    y: float
    spId: int
    spGrade: int
    spLevel: int

# 예측 API
@app.post("/predict")
def predict_shot(data: ShotInput):
    x, y = data.x, data.y
    print("x", x)
    print("y", y)
    distance = calculate_distance(x, y)
    angle = calculate_angle(x, y)

    row = pd.DataFrame([{
        'x': x, 'y': y,
        'spId': data.spId,
        'spGrade': data.spGrade,
        'spLevel': data.spLevel,
        'distance': distance,
        'angle': angle,
        'x_times_y': x * y,
        'distance_times_angle': distance * angle,
        'x_div_distance': x / (distance + 1e-6),
        'angle_squared': angle ** 2,
        'x_squared': x ** 2,
        'y_squared': y ** 2,
        'hitPost': 0,
        'hitPost_distance': 0
    }])

    try:
        features = model.feature_names_in_
    except:
        features = model.get_booster().feature_names

    for col in features:
        if col not in row.columns:
            row[col] = 0
    row = row[features]

    # 실제 사용할 땐 아래처럼 학습 시 저장된 scaler를 불러와야 합니다.
    scaler = joblib.load("app/scaler.pkl")
    row_scaled = scaler.transform(row)
    
    # row_scaled = scaler.transform(row)

    proba = model.predict_proba(row_scaled)[:, 1][0]
    print(proba)
    pred = int(proba >= 0.5)
    print(pred)

    return {
        "goal_proba": round(proba, 4),
        "goal_pred": pred
    }
