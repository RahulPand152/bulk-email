import { NextResponse } from "next/server";

export async function POST() {
  try {
    
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: new Date(0), 
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

