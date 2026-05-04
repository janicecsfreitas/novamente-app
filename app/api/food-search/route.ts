import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ foods: [] });
  }

  try {
    const response = await fetch(
      `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}`,
      {
        headers: {
          "x-app-id": process.env.NUTRITIONIX_APP_ID || "d3a7c9c0",
          "x-app-key": process.env.NUTRITIONIX_APP_KEY || "d98f13e59e34e0b863e74e9a6c6e1b74",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ foods: [] }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Food search error:", error);
    return NextResponse.json({ foods: [] }, { status: 500 });
  }
}