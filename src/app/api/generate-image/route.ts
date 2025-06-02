import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const API_TOKEN = process.env.CF_API_TOKEN;
    if (!API_TOKEN) {
      return NextResponse.json({ error: "API token is not configured on the server" }, { status: 500 });
    }
    
    const accountId = process.env.CF_ACCOUNT_ID;
    if (!accountId) {
      return NextResponse.json({ error: "Account ID is not configured on the server" }, { status: 500 });
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API request failed with status ${response.status}: ${errorText}` }, 
        { status: response.status }
      );
    }

    // Check content type to determine how to process the response
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('image')) {
      // If the response is an image, return it as a base64 data URL
      const imageBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const dataUrl = `data:${contentType};base64,${base64Image}`;
      
      return NextResponse.json({ success: true, result: { image: dataUrl } });
    } else if (contentType && contentType.includes('application/json')) {
      // If the response is JSON, parse it normally
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // For other content types, return an error
      return NextResponse.json(
        { error: `Unexpected content type: ${contentType}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}
