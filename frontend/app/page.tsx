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
  patient_context: PatientContext;
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
  const [cFile, setCFile] = useState<File | null>(null);
  const [vFile, setVFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  async function handleReconcileFileUpload() {
    if (!cFile) return;

    try {
      const text = await cFile.text();
      const transformed = JSON.parse(text);
      setFileError(null);
      console.log(JSON.stringify(transformed));
      const res = await fetch("/api/ReconcileRoute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformed),
      });

      const data = await res.json();
      setReconcileData(data);
    } catch (e) {
      console.error(e);
      setFileError("Invalid Upload");
    }
  }

  async function handleValidateFileUpload() {
    try {
      if (!vFile) return;

      const text = await vFile.text();
      const jsonText = JSON.parse(text);
      setFileError(null);
      const res = await fetch("/api/ValidateRoute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonText),
      });
    } catch (e) {
      console.error(e);
      setFileError("Invalid Upload");
    }
  }

  // useEffect(() => {
  //   setValidateData({
  //     overall_score: 62,
  //     breakdown: {
  //       completeness: 60,
  //       accuracy: 50,
  //       timeliness: 70,
  //       clinical_plausibility: 40,
  //     },
  //     issues_detected: [
  //       {
  //         field: "allergies",
  //         issue: "No allergies documented - likely incomplete",
  //         severity: "medium",
  //       },
  //       {
  //         field: "vital_signs.blood_pressure",
  //         issue: "Blood pressure 340/180 is physiologically implausible",
  //         severity: "high",
  //       },
  //       {
  //         field: "last_updated",
  //         issue: "Data is 7+ months old",
  //         severity: "medium",
  //       },
  //     ],
  //   });
  // }, []);

  return (
    <div className="p-6 space-y-8 bg-gray-500 min-h-screen text-white">
      <h1 className="text-5xl font-bold border-b w-fit">
        Clinical Data Validation
      </h1>
      <div className="flex justify-evenly mt-16">
        <div className="bg-gray-600 p-8 rounded-lg space-y-4 w-fit">
          <h2 className="text-2xl font-semibold text-center">
            Upload Reconcile File
          </h2>
          <input
            type="file"
            accept=".txt"
            onChange={(e) => setCFile(e.target.files?.[0] || null)}
            className="block w-80 text-sm bg-gray-700 rounded-lg p-4 hover:bg-gray-800"
          />
          {fileError && <p className="text-red-400 text-sm">{fileError}</p>}

          <button
            onClick={handleReconcileFileUpload}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg font-semibold"
          >
            Submit File
          </button>
        </div>

        <div className="bg-gray-600 p-8 rounded-lg space-y-4 w-fit">
          <h2 className="text-2xl font-semibold text-center">
            Upload Validate File
          </h2>
          <input
            type="file"
            accept=".txt"
            onChange={(e) => setVFile(e.target.files?.[0] || null)}
            className="block w-80 text-sm bg-gray-700 rounded-lg p-4 hover:bg-gray-800"
          />
          {fileError && <p className="text-red-400 text-sm">{fileError}</p>}

          <button
            onClick={handleValidateFileUpload}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg font-semibold"
          >
            Submit File
          </button>
        </div>
      </div>

      {reconcileData && (
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
      )}

      {validateData && (
        <div>
          <div className="border-b pb-4">
            <DataQualityCard
              title="Overall Score"
              score={validateData.overall_score}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(validateData.breakdown || {}).map(
                ([key, value]) => (
                  <DataQualityCard
                    key={key}
                    title={key}
                    score={value as number}
                  />
                ),
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Issues Detected</h2>

            {(validateData.issues_detected || []).map(
              (x: IssueProps, idx: number) => (
                <IssueComponent
                  key={idx}
                  issue={x.issue}
                  severity={x.severity}
                  field={x.field}
                />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
