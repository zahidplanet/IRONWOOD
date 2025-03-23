from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import random
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Simulated AI models and data
investment_styles = {
    "warren_buffett": {
        "name": "Warren Buffett",
        "style": "Value Investing",
        "metrics": ["P/E Ratio", "Debt-to-Equity", "Return on Equity", "Competitive Advantage"]
    },
    "cathie_wood": {
        "name": "Cathie Wood",
        "style": "Disruptive Innovation",
        "metrics": ["Market Potential", "Innovation Rate", "Growth Rate", "Industry Disruption"]
    },
    "charlie_munger": {
        "name": "Charlie Munger",
        "style": "Mental Models & Value",
        "metrics": ["Long-term Outlook", "Management Quality", "Business Model", "Competitive Moat"]
    }
}

@app.route('/')
def index():
    return jsonify({"status": "AI Hedge Fund API is running"})

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "version": "1.0.0",
        "services": {
            "ai_models": "operational",
            "data_feed": "operational"
        }
    })

@app.route('/api/portfolio/analysis', methods=['POST'])
def portfolio_analysis():
    data = request.json
    portfolio = data.get('portfolio', [])
    
    # Simulate analysis (in real app would use actual AI models)
    time.sleep(1)  # Simulate processing time
    
    analysis_results = []
    for stock in portfolio:
        analysis_results.append({
            "symbol": stock['symbol'],
            "analysis": {
                "sentiment": random.uniform(0, 1),
                "fundamentals": random.uniform(0, 1),
                "technicals": random.uniform(0, 1),
                "risk": random.uniform(0, 1)
            },
            "recommendation": random.choice(["BUY", "HOLD", "SELL"]),
            "confidence": random.uniform(0.5, 0.95),
            "reasoning": f"Analysis based on current market conditions and {stock['symbol']}'s performance metrics."
        })
    
    return jsonify({
        "results": analysis_results,
        "timestamp": time.time()
    })

@app.route('/api/investor/analysis', methods=['POST'])
def investor_analysis():
    data = request.json
    symbol = data.get('symbol')
    investor = data.get('investor', 'warren_buffett')
    
    # Get the investor style
    style = investment_styles.get(investor, investment_styles['warren_buffett'])
    
    # Simulate investor-specific analysis
    time.sleep(0.5)  # Simulate processing time
    
    return jsonify({
        "symbol": symbol,
        "investor": style["name"],
        "style": style["style"],
        "analysis": {
            metric: random.uniform(0, 1) for metric in style["metrics"]
        },
        "recommendation": random.choice(["BUY", "HOLD", "SELL"]),
        "confidence": random.uniform(0.6, 0.9),
        "reasoning": f"{style['name']} would evaluate {symbol} primarily on {', '.join(style['metrics'])}."
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting AI Hedge Fund API server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True) 