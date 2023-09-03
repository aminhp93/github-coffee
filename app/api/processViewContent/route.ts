import { NextResponse } from "next/server";
import { INVALID_RES, VALID_RES_1, VALID_RES_2, VALID_RES_3 } from "./contants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");
  let res = INVALID_RES;
  if (uuid === "da05b610-426b-45d9-a89f-b65c5657766f") {
    res = VALID_RES_1;
  } else if (uuid === "9adf235c-d80c-46b7-af30-54dde71ec865") {
    res = VALID_RES_2;
  } else if (uuid === "87b5ccdc-4d30-48d9-b061-234c20dfb95f") {
    res = VALID_RES_3;
  }
  return NextResponse.json(res);
}
