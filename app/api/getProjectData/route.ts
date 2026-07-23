import { NextResponse } from "next/server";
import fs from "fs";


export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        const data = fs.readFileSync(requestData, "utf8");
        const parsedData = JSON.parse(data);
        return NextResponse.json(parsedData);
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
