import { NextResponse } from "next/server";

const REQUIRED_FIELDS = [
  "sectionType",
  "layout",
  "presentation",
  "style",
  "typography",
] as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 },
      );
    }
  }

  const html = `<!-- mock response -->\n<section data-generated-at="${new Date().toISOString()}">\n  <h2>${body.sectionType} (${body.style})</h2>\n  <p>Layout: ${body.layout}, Presentation: ${body.presentation}, Typography: ${body.typography}</p>\n</section>`;

  return NextResponse.json({ html });
}
