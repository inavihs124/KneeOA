from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from flare_predictor import FlareUpPredictor, TherapyOptimizer

app = FastAPI(title="ArthroEase ML Service", version="1.0.0")
predictor = FlareUpPredictor()
optimizer = TherapyOptimizer()

class PredictRequest(BaseModel):
    impedance_trend: List[float] = [300, 310, 320, 330, 340, 350, 360]
    pain_history: List[float] = [5, 5, 5, 5, 5, 5, 5]
    activity_level: float = 5
    sleep_quality: float = 5
    weather_pressure: float = 1013

class OptimizeRequest(BaseModel):
    impedance: float = 300
    temperature: float = 37.0
    heart_rate: float = 72
    pain_score: float = 5

@app.get("/health")
def health():
    return {"status": "ok", "service": "ArthroEase ML"}

@app.post("/predict")
def predict(req: PredictRequest):
    return predictor.predict(req.dict())

@app.post("/optimize")
def optimize(req: OptimizeRequest):
    return optimizer.optimize(req.dict())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
