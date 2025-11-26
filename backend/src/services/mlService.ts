import axios from 'axios';

interface CreditScoreInput {
    age: number;
    salary: number;
    balance: number;
    txCount: number;
    country?: string;
}

interface CreditScorePrediction {
    predictedScore: number;
    confidence: number;
    riskLevel: 'low' | 'medium' | 'high';
    factors: {
        age: number;
        salary: number;
        balance: number;
        txCount: number;
    };
    recommendations: string[];
}

export class MLService {
    private mlApiUrl: string;
    private mlApiKey: string | undefined;

    constructor() {
        this.mlApiUrl = process.env.ML_API_URL || 'http://localhost:5001';
        this.mlApiKey = process.env.ML_API_KEY;
    }

    /**
     * Predict credit score using ML model
     * Falls back to rule-based prediction if ML API is unavailable
     */
    public async predictCreditScore(input: CreditScoreInput): Promise<CreditScorePrediction> {
        try {
            // Try to use external ML API if configured
            if (this.mlApiUrl && this.mlApiUrl !== 'http://localhost:5001') {
                return await this.callMLAPI(input);
            }
        } catch (error) {
            console.warn('ML API unavailable, using local prediction model:', error);
        }

        // Fallback to local ML model (rule-based + simple regression)
        return this.localPredictCreditScore(input);
    }

    /**
     * Call external ML API
     */
    private async callMLAPI(input: CreditScoreInput): Promise<CreditScorePrediction> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.mlApiKey) {
            headers['Authorization'] = `Bearer ${this.mlApiKey}`;
        }

        const response = await axios.post(
            `${this.mlApiUrl}/predict/credit-score`,
            input,
            { headers, timeout: 5000 }
        );

        return response.data;
    }

    /**
     * Local credit score prediction model
     * Uses a weighted formula based on multiple factors
     */
    private localPredictCreditScore(input: CreditScoreInput): CreditScorePrediction {
        const { age, salary, balance, txCount } = input;

        // Base score starts at 300
        let score = 300;

        // Age factor (optimal range: 25-55)
        if (age >= 25 && age <= 55) {
            score += 50;
        } else if (age >= 18 && age < 25) {
            score += 20;
        } else if (age > 55 && age <= 70) {
            score += 40;
        }

        // Salary factor (normalized to 0-150 range)
        // Assuming salary range: 20k - 200k
        const normalizedSalary = Math.min(Math.max((salary - 20000) / 180000, 0), 1);
        score += normalizedSalary * 150;

        // Balance factor (normalized to 0-100 range)
        // Assuming balance range: 0 - 200k
        const normalizedBalance = Math.min(Math.max(balance / 200000, 0), 1);
        score += normalizedBalance * 100;

        // Transaction count factor (moderate activity is good)
        // Assuming optimal: 10-50 transactions
        if (txCount >= 10 && txCount <= 50) {
            score += 50;
        } else if (txCount > 50 && txCount <= 100) {
            score += 30;
        } else if (txCount < 10) {
            score += 10;
        }

        // Country factor (if provided)
        if (input.country) {
            const highTrustCountries = ['US', 'CA', 'GB', 'AU', 'DE'];
            if (highTrustCountries.includes(input.country)) {
                score += 20;
            }
        }

        // Cap score between 300-850
        score = Math.max(300, Math.min(850, Math.round(score)));

        // Calculate confidence based on data completeness
        let confidence = 0.85;
        if (!input.country) confidence -= 0.05;
        if (salary < 10000 || salary > 500000) confidence -= 0.1;
        if (balance < 0) confidence -= 0.2;

        confidence = Math.max(0.5, Math.min(1.0, confidence));

        // Determine risk level
        let riskLevel: 'low' | 'medium' | 'high';
        if (score >= 720) {
            riskLevel = 'low';
        } else if (score >= 650) {
            riskLevel = 'medium';
        } else {
            riskLevel = 'high';
        }

        // Generate recommendations
        const recommendations: string[] = [];
        if (score < 650) {
            recommendations.push('Consider increasing account balance');
            recommendations.push('Maintain regular transaction activity');
        }
        if (age < 25) {
            recommendations.push('Build credit history over time');
        }
        if (txCount < 5) {
            recommendations.push('Increase transaction frequency');
        }
        if (salary < 50000) {
            recommendations.push('Work on increasing income level');
        }

        return {
            predictedScore: score,
            confidence,
            riskLevel,
            factors: {
                age,
                salary,
                balance,
                txCount,
            },
            recommendations,
        };
    }

    /**
     * Batch predict credit scores for multiple users
     */
    public async batchPredictCreditScores(inputs: CreditScoreInput[]): Promise<CreditScorePrediction[]> {
        const predictions = await Promise.all(
            inputs.map(input => this.predictCreditScore(input))
        );
        return predictions;
    }

    /**
     * Detect fraud/anomalies in user data
     */
    public async detectFraud(input: CreditScoreInput): Promise<{
        isFraud: boolean;
        fraudScore: number;
        anomalies: string[];
    }> {
        const anomalies: string[] = [];
        let fraudScore = 0;

        // Check for suspicious patterns
        if (input.age < 18 || input.age > 100) {
            anomalies.push('Invalid age');
            fraudScore += 30;
        }

        if (input.salary < 0 || input.salary > 1000000) {
            anomalies.push('Suspicious salary range');
            fraudScore += 20;
        }

        if (input.balance < 0) {
            anomalies.push('Negative balance');
            fraudScore += 25;
        }

        if (input.txCount < 0 || input.txCount > 10000) {
            anomalies.push('Abnormal transaction count');
            fraudScore += 15;
        }

        // High salary with very low balance is suspicious
        if (input.salary > 100000 && input.balance < 1000) {
            anomalies.push('High salary but low balance');
            fraudScore += 20;
        }

        return {
            isFraud: fraudScore > 50,
            fraudScore: Math.min(100, fraudScore),
            anomalies,
        };
    }
}

export const mlService = new MLService();

