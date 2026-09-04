import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (accessKey) {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          message,
          subject: `Portfolio Inquiry from ${name}`,
          from_name: "Satyam Chaurasia Portfolio",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to deliver message via Web3Forms.");
      }
    } else {
      // In development or when access key is not yet configured,
      // log to server console for verification
      console.log("-----------------------------------------");
      console.log("📩 NEW PORTFOLIO CONTACT MESSAGE RECEIVED:");
      console.log("From:", name, `<${email}>`);
      console.log("Message:", message);
      console.log("Target recipient: chaurasiasatyam05@gmail.com");
      console.log("-----------------------------------------");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message received successfully! I will reply within 24 hours.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      {
        error: "Message delivery failed. You can also email directly at chaurasiasatyam05@gmail.com",
      },
      { status: 500 }
    );
  }
}
