import { RES_ALL, RES_NOT_EMPTY } from "./constants";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // get the params from the request
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "ALL") {
    return NextResponse.json({ data: RES_ALL });
  } else if (type === "NOT_EMPTY") {
    return NextResponse.json({ data: RES_NOT_EMPTY });
  }
  return NextResponse.json({ data: [] });
}
