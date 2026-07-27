import { NextResponse } from "next/server";
import fs from "fs";
import portfolioAssistant from "@/app/data/PortfolioAssistant.json";
import popChoice from "@/app/data/PopChoice.json";
import travelAgent from "@/app/data/TravelAgent.json";
import pollyglot from "@/app/data/Pollyglot.json";


export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        let parsedData;

        switch (requestData) {
            case "PortfolioAssistant.json":
                parsedData = portfolioAssistant;
                break;
            case "PopChoice.json":
                parsedData = popChoice;
                break;
            case "TravelAgent.json":
                parsedData = travelAgent;
                break;
            default:
                return NextResponse.json({ error: "Invalid project data request" }, { status: 400 });
        }

        return NextResponse.json(parsedData);
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
