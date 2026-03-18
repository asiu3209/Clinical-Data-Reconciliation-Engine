"use client";

import { useState } from "react";

export interface IssueProps {
  field: string;
  issue: string;
  severity: string;
}

export default function IssueComponent({ field, issue, severity }: IssueProps) {
  const [decision, setDecision] = useState("");
  return (
    <div className="mt-4 border rounded-lg p-4 space-y-2 bg-gray-700">
      <p>
        <strong>Field:</strong> {field}
      </p>
      <p>
        <strong>Issue:</strong> {issue}
      </p>
      <p>
        <strong>Severity:</strong> {severity}
      </p>

      <div className="flex gap-2 pt-2 border-t">
        <button
          className="font-bold bg-gray-200 text-green-600 rounded-md p-1 hover:bg-gray-300"
          onClick={() => setDecision("Approved")}
        >
          Approve
        </button>
        <button
          className="font-bold bg-gray-200 text-red-600 rounded-md p-1 hover:bg-gray-300"
          onClick={() => setDecision("Rejected")}
        >
          Reject
        </button>
      </div>
      {decision && (
        <div className="pt-4">
          <p className="font-semibold">Decision: {decision}</p>
        </div>
      )}
    </div>
  );
}
