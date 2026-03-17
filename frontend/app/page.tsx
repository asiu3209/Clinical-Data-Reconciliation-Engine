"use client";

import { useEffect, useState } from "react";
import DataQualityCard from "./components/DataQualityCard";

export default function MainPage() {
  const [data, setData] = useState({
    overall_score: 72,
    breakdown: {
      completeness: 80,
      accuracy: 70,
      timeliness: 60,
      clinical_plausibility: 75,
    },
    issues_detected: [
      {
        field: "vital_signs.blood_pressure",
        issue: "Slightly elevated blood pressure",
        severity: "medium",
        confidence: 0.78,
        reasoning: "Above recommended range",
      },
    ],
  });

  async function callReconcile() {}

  async function callValidate() {}
  const [decision, setDecision] = useState("");

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-8 bg-gray-500">
      <h1 className="text-2xl font-bold">Clinical Data Validation</h1>

      {/* Overall Score */}
      <div className="border-b pb-4">
        <DataQualityCard title="Overall Score" score={data.overall_score} />
      </div>

      {/* Breakdown */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.breakdown).map(([key, value]) => (
            <DataQualityCard key={key} title={key} score={value} />
          ))}
        </div>
      </div>

      {/* Issues */}
      <div>
        <h2 className="text-lg font-semibold">Issues Detected</h2>

        {data.issues_detected.map((issue, idx) => (
          <div key={idx} className="mt-4 border rounded-lg p-4 space-y-2">
            <p>
              <strong>Field:</strong> {issue.field}
            </p>
            <p>
              <strong>Issue:</strong> {issue.issue}
            </p>
            <p>
              <strong>Severity:</strong> {issue.severity}
            </p>
            <p>
              <strong>Confidence:</strong> {issue.confidence}
            </p>
            <p>
              <strong>Reasoning:</strong> {issue.reasoning}
            </p>

            <div className="flex gap-2 pt-2 border-t">
              <button
                className="font-bold bg-gray-200 text-green-500 border-t border-black rounded-md p-1 hover:bg-gray-300"
                onClick={() => setDecision("Approved")}
              >
                Approve
              </button>
              <button
                className="font-bold bg-gray-200 text-red-500 border-t border-black rounded-md p-1 hover:bg-gray-300"
                onClick={() => setDecision("Rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Decision */}
      {decision && (
        <div className="pt-4">
          <p className="font-semibold">Decision: {decision}</p>
        </div>
      )}
    </div>
  );
}
