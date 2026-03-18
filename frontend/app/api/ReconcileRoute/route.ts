import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Incoming data:", data);

    const response = await fetch(
      "http://localhost:8000/api/reconcile/medication",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const text = await response.text();
    console.log("FastAPI raw response:", text);

    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("API Route Error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
