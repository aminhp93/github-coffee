import { NextResponse } from "next/server";
import { RES } from "./constants";

// Params
// chain:"ff99d4e3-c340-4f1e-84b7-be3e2c092cb3"
// skipContent: true
// skipThumbnail: true
export async function GET(request: Request) {
  return NextResponse.json({
    pv: RES,
  });
}
