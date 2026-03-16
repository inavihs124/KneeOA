import numpy as np
from typing import Dict, List

class FlareUpPredictor:
    """Predicts flare-up risk based on user biofeedback and activity data."""
    
    def extract_features(self, user_data: dict) -> np.ndarray:
        impedance = user_data.get('impedance_trend', [300]*7)
        pain = user_data.get('pain_history', [5]*7)
        activity = user_data.get('activity_level', 5)
        sleep = user_data.get('sleep_quality', 5)
        weather_pressure = user_data.get('weather_pressure', 1013)
        
        features = [
            np.mean(impedance), np.std(impedance),
            (impedance[-1] - impedance[0]) / len(impedance) if len(impedance) > 1 else 0,
            np.max(impedance) - np.min(impedance),
            np.mean(pain), np.std(pain),
            (pain[-1] - pain[0]) / len(pain) if len(pain) > 1 else 0,
            activity, sleep, weather_pressure
        ]
        return np.array(features).reshape(1, -1)
    
    def predict(self, user_data: dict) -> Dict:
        features = self.extract_features(user_data)
        
        # Heuristic scoring (replace with trained model in production)
        avg_imp = features[0, 0]
        imp_slope = features[0, 2]
        avg_pain = features[0, 4]
        pain_slope = features[0, 6]
        activity = features[0, 7]
        sleep = features[0, 8]
        pressure = features[0, 9]
        
        risk = 0.0
        risk += max(0, (avg_imp - 250) / 5)
        risk += max(0, imp_slope * 10)
        risk += avg_pain * 6
        risk += max(0, pain_slope * 15)
        risk += max(0, (5 - activity) * 3)
        risk += max(0, (5 - sleep) * 4)
        risk += max(0, (1013 - pressure) * 0.5)
        
        risk_score = min(100, max(0, round(risk)))
        risk_level = 'high' if risk_score > 70 else 'moderate' if risk_score > 40 else 'low'
        hours_ahead = 24 if risk_score > 70 else 48 if risk_score > 40 else 72
        
        factors = []
        if imp_slope > 0: factors.append('rising_impedance')
        if avg_pain > 5: factors.append('high_pain_baseline')
        if activity < 4: factors.append('low_activity')
        if sleep < 4: factors.append('poor_sleep')
        if pressure < 1010: factors.append('low_pressure')
        
        recommendations = []
        if risk_score > 70: recommendations.append('Start preventive therapy session immediately')
        if risk_score > 40: recommendations.extend(['Reduce strenuous activity', 'Apply heat therapy', 'Stay hydrated'])
        recommendations.append('Continue monitoring symptoms')
        
        return {
            'risk_score': risk_score, 'risk_level': risk_level,
            'hours_ahead': hours_ahead, 'confidence': 0.78,
            'contributing_factors': factors, 'recommendations': recommendations
        }


class TherapyOptimizer:
    """Optimizes therapy parameters based on current biofeedback state."""
    
    def optimize(self, session_data: dict) -> Dict:
        impedance = session_data.get('impedance', 300)
        temperature = session_data.get('temperature', 37.0)
        heart_rate = session_data.get('heart_rate', 72)
        pain_score = session_data.get('pain_score', 5)
        
        heat = min(100, max(0, (impedance - 200) / 4 + pain_score * 5))
        vibration = min(200, max(0, 150 - pain_score * 10))
        duration = min(45, max(10, 15 + pain_score * 2))
        
        if temperature > 38: heat *= 0.7
        if heart_rate > 90: vibration *= 0.8
        
        return {
            'heat_intensity': round(heat),
            'vibration_freq': round(vibration),
            'session_duration': round(duration),
            'mode': 'auto_adaptive'
        }
