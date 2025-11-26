'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api-client';

type ProofInputs = {
  creditScore: number;
  salary: number;
  balance: number;
  minCreditScore: number;
  minSalary: number;
  minBalance: number;
};

type DemoResult = {
  proofId?: string;
  verified?: boolean;
  status?: string;
  verifiedAt?: string;
  savedAt?: string;
  isSimulated?: boolean;
  isValid?: boolean;
  publicSignals?: string[];
  message?: string;
  error?: string;
};

const DEFAULT_INPUTS: ProofInputs = {
  creditScore: 740,
  salary: 85000,
  balance: 12000,
  minCreditScore: 700,
  minSalary: 60000,
  minBalance: 5000,
};

export default function ZKPDemo() {
  const [inputs, setInputs] = useState<ProofInputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof ProofInputs) => (value: string) => {
    const numericValue = Number(value);
    setInputs((prev) => ({
      ...prev,
      [field]: Number.isFinite(numericValue) ? numericValue : prev[field],
    }));
  };

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);

    try {
      const proofResponse = await apiClient.generateProof('snark', inputs);

      if (!proofResponse.success || !proofResponse.data) {
        throw new Error(proofResponse.error || 'Failed to generate proof via backend');
      }

      const proofRecord: any = proofResponse.data;

      const verifyResponse = await apiClient.verifyProof(proofRecord.proofId, 'snark');

      if (!verifyResponse.success || !verifyResponse.data) {
        throw new Error(verifyResponse.error || 'Failed to verify proof via backend');
      }

      setResult({
        proofId: proofRecord.proofId,
        status: verifyResponse.data.status,
        verified: verifyResponse.data.verified,
        verifiedAt: verifyResponse.data.verifiedAt,
        savedAt: proofRecord.createdAt,
        isSimulated: proofRecord.proofData?.isSimulated ?? false,
        isValid: proofRecord.proofData?.isValid ?? proofRecord.verified,
        publicSignals: proofRecord.proofData?.publicSignals,
        message: proofRecord.proofData?.isValid
          ? 'User meets the credit proof requirements.'
          : 'User falls short of the configured credit requirements.',
      });
    } catch (error: any) {
      console.error('Proof flow error:', error);
      setResult({
        error: error.message || 'Unable to reach the backend API. Ensure both services are running.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fieldConfig = useMemo(
    () => [
      {
        key: 'creditScore' as const,
        label: 'Credit Score',
        helper: 'Private input; not shared during verification.',
        min: 300,
        max: 900,
      },
      {
        key: 'salary' as const,
        label: 'Annual Salary (USD)',
        helper: 'Private input; used for eligibility.',
        min: 0,
        step: 1000,
      },
      {
        key: 'balance' as const,
        label: 'Account Balance (USD)',
        helper: 'Private input; demonstrates asset thresholds.',
        min: 0,
        step: 500,
      },
      {
        key: 'minCreditScore' as const,
        label: 'Minimum Credit Score',
        helper: 'Public constraint enforced by the circuit.',
        min: 300,
        max: 900,
      },
      {
        key: 'minSalary' as const,
        label: 'Minimum Salary (USD)',
        helper: 'Public constraint for salary.',
        min: 0,
        step: 1000,
      },
      {
        key: 'minBalance' as const,
        label: 'Minimum Balance (USD)',
        helper: 'Public constraint for assets.',
        min: 0,
        step: 500,
      },
    ],
    []
  );

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Zero-Knowledge Credit Proof Demo</CardTitle>
          <CardDescription>
            Generate and verify a credit-eligibility proof against the Express backend without revealing any
            sensitive inputs to the verifier.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldConfig.map(({ key, label, helper, min, max, step }) => (
              <div className="space-y-2" key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type="number"
                  value={inputs[key]}
                  onChange={(e) => handleInputChange(key)(e.target.value)}
                  min={min}
                  max={max}
                  step={step}
                />
                <p className="text-xs text-muted-foreground">{helper}</p>
              </div>
            ))}
          </div>

          <Button onClick={handleVerify} disabled={loading} className="w-full md:w-auto">
            {loading ? 'Generating & Verifying...' : 'Generate Proof via Backend'}
          </Button>

          {result && (
            <div
              className={`p-4 rounded-md border ${
                result.error
                  ? 'border-destructive/50 bg-destructive/10'
                  : result.verified
                  ? 'border-green-500/40 bg-green-500/10'
                  : 'border-yellow-500/40 bg-yellow-500/10'
              }`}
            >
              {result.error ? (
                <p className="text-destructive font-medium">Error: {result.error}</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <p className="text-base font-semibold">
                    {result.verified ? '✅ Proof verified successfully' : '⚠️ Proof verification failed'}
                  </p>
                  {result.message && <p className="text-muted-foreground">{result.message}</p>}
                  <div className="grid md:grid-cols-2 gap-2 text-xs">
                    <span>
                      Proof ID:{' '}
                      <span className="font-mono break-all text-primary">{result.proofId || 'N/A'}</span>
                    </span>
                    <span>Status: {result.status || 'unknown'}</span>
                    <span>Saved: {result.savedAt ? new Date(result.savedAt).toLocaleString() : 'N/A'}</span>
                    <span>
                      Verified:{' '}
                      {result.verifiedAt ? new Date(result.verifiedAt).toLocaleString() : 'not yet recorded'}
                    </span>
                    <span>Simulated Proof: {result.isSimulated ? 'Yes' : 'No'}</span>
                    <span>Constraint Outcome: {result.isValid ? 'Meets criteria' : 'Fails criteria'}</span>
                  </div>
                  {result.publicSignals?.length ? (
                    <div className="text-xs">
                      <p className="font-medium">Public Signals</p>
                      <p className="font-mono break-all">{result.publicSignals.join(', ')}</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <h3 className="font-medium mb-2">Flow</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Submit private credit metrics plus the threshold you want to prove.</li>
              <li>The frontend calls the Express backend at <code>/api/zkp/generate</code> to create a proof.</li>
              <li>The saved proof is immediately verified through <code>/api/zkp/verify</code>.</li>
              <li>The verifier only sees proof artifacts and public signals, never the sensitive inputs.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
