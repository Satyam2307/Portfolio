import { NextResponse } from "next/server";

// In-memory rate limiting map (IP -> array of timestamps)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up old rate limit records periodically
function cleanRateLimitMap() {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recent);
    }
  }
}

// Basic HTML sanitization function to prevent XSS / script injections
function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return str
    .trim()
    .replace(/[<>]/g, "") // Strip raw tags
    .slice(0, 3000); // Strict length boundary
}

// Simple email format verification regex
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip";

    const now = Date.now();
    cleanRateLimitMap();
    const timestamps = rateLimitMap.get(clientIp) || [];
    const recentRequests = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    rateLimitMap.set(clientIp, [...recentRequests, now]);

    // 2. Parse and Validate Payload
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request payload." }, { status: 400 });
    }

    const rawName = body?.name;
    const rawEmail = body?.email;
    const rawPhone = body?.phone;
    const rawMessage = body?.message;

    if (!rawName || !rawEmail || !rawMessage) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const name = sanitizeInput(rawName).slice(0, 100);
    const email = sanitizeInput(rawEmail).toLowerCase().slice(0, 100);
    const phone = rawPhone ? sanitizeInput(rawPhone).slice(0, 30) : "";
    const message = sanitizeInput(rawMessage).slice(0, 3000);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid name." },
        { status: 400 }
      );
    }

    if (message.length < 5) {
      return NextResponse.json(
        { error: "Message is too short." },
        { status: 400 }
      );
    }

    // 3. Dispatch Message
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
          phone: phone || "Not provided",
          message,
          subject: `Portfolio Inquiry from ${name}${phone ? ` (${phone})` : ""}`,
          from_name: "Satyam Chaurasia Portfolio",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to deliver message via Web3Forms.");
      }
    } else {
      console.log("-----------------------------------------");
      console.log("📩 NEW PORTFOLIO CONTACT MESSAGE RECEIVED (Development Mode):");
      console.log("From:", name, `<${email}>`);
      if (phone) console.log("Phone:", phone);
      console.log("Message:", message);
      console.log("Recipient:", "chaurasiasatyam05@gmail.com");
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
        error: "Message delivery failed. You can also connect directly via WhatsApp or email.",
      },
      { status: 500 }
    );
  }
}
