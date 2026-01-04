import { NextResponse } from "next/server";

const ZAVU_API_URL = "zv_live_ba4947d43860ce25a0fde1cfbb68ffc84918cbd5560115b6"; 

export async function POST(req: Request) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { to, channel, message } = body as {
      to: string;
      channel: "sms" | "whatsapp";
      message: string;
    };

    if (!to || !channel || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send POST request to Zavu
    const response = await fetch(ZAVU_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ZAVU_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, channel, message }),
    });

    const data = await response.json();

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
