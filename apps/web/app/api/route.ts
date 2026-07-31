import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "OK", service: "FounderHQ Web BFF API Gateway" });
}
