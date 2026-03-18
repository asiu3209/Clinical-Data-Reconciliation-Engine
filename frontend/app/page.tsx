"use client";

import { useEffect, useState } from "react";
import DataQualityCard from "./components/DataQualityCard";
import IssueComponent from "./components/IssueComponent";
import { IssueProps } from "./components/IssueComponent";

export interface PatientContext {
  age: number;
  conditions: string[];
  recent_labs: Record<string, any>;
}

export interface SourceRecord {
  system: string;
  medication: string;
  last_updated?: string;
  last_filled?: string;
  source_reliability: string | number;
}

export interface ReconcileRequest {
  patient: PatientContext;
  sources: SourceRecord[];
}

export interface ValidateRequest {
  demographics: Record<string, any>;
  medications: string[];
  allergies: string[];
  conditions: string[];
  vital_signs: Record<string, any>;
  last_updated: string;
}

export default function MainPage() {
  const [reconcileData, setReconcileData] = useState<any>(null);
  const [validateData, setValidateData] = useState<any>(null);
  // 🔹 MOCK DATA (your example)
  useEffect(() => {
    setValidateData({
      overall_score: 62,
      breakdown: {
        completeness: 60,
        accuracy: 50,
        timeliness: 70,
        clinical_plausibility: 40,
      },
      issues_detected: [
        {
          field: "allergies",
          issue: "No allergies documented - likely incomplete",
          severity: "medium",
        },
        {
          field: "vital_signs.blood_pressure",
          issue: "Blood pressure 340/180 is physiologically implausible",
          severity: "high",
        },
        {
          field: "last_updated",
          issue: "Data is 7+ months old",
          severity: "medium",
        },
      ],
    });

    setReconcileData({
      reconciled_medication: "Metformin 500mg twice daily",
      confidence_score: 0.88,
      reasoning:
        "Primary care record is most recent. Dose reduced due to kidney function.",
      recommended_actions: [
        "Update Hospital EHR to 500mg twice daily",
        "Verify with pharmacist",
      ],
      clinical_safety_check: "PASSED",
    });
  }, []);

  if (!validateData || !reconcileData)
    return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-8 bg-gray-500 min-h-screen text-white">
      <h1 className="text-2xl font-bold">Clinical Data Validation</h1>

      {/* 🔹 Reconcile Section */}
      <div className="bg-gray-700 p-4 rounded-lg space-y-2">
        <h2 className="text-lg font-semibold">Reconciled Medication</h2>

        <p>
          <strong>Medication:</strong> {reconcileData.reconciled_medication}
        </p>
        <p>
          <strong>Confidence:</strong> {reconcileData.confidence_score}
        </p>
        <p>
          <strong>Safety:</strong> {reconcileData.clinical_safety_check}
        </p>
        <p>
          <strong>Reasoning:</strong> {reconcileData.reasoning}
        </p>

        <div>
          <strong>Recommended Actions:</strong>
          <ul className="list-disc ml-5">
            {(reconcileData.recommended_actions || []).map(
              (action: string, i: number) => (
                <li key={i}>{action}</li>
              ),
            )}
          </ul>
        </div>
      </div>

      {/* 🔹 Overall Score */}
      <div className="border-b pb-4">
        <DataQualityCard
          title="Overall Score"
          score={validateData.overall_score}
        />
      </div>

      {/* 🔹 Breakdown */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(validateData.breakdown || {}).map(([key, value]) => (
            <DataQualityCard key={key} title={key} score={value as number} />
          ))}
        </div>
      </div>

      {/* 🔹 Issues */}
      <div>
        <h2 className="text-lg font-semibold">Issues Detected</h2>

        {(validateData.issues_detected || []).map(
          (x: IssueProps, idx: number) => (
            <IssueComponent
              issue={x.issue}
              severity={x.severity}
              field={x.field}
            ></IssueComponent>
          ),
        )}
      </div>
    </div>
  );
}
