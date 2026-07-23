---
sourceType: project
sourceTitle: AI Travel Planner
sourceUrl: /singleProject?dataFile=.%2Fapp%2Fdata%2FTravelAgent.json
keywords:
  - project
  - projects
  - portfolio
  - travel
  - recommendation
  - agents
  - rag
---

# Matthew Johnson Project name
AI Travel Planner

## Overview

The AI Travel Planner helps users quickly plan trips by finding flights, hotels, and weather information through a single conversational interface.

## Why I Built It

Planning a trip often requires searching multiple websites before making a decision. I wanted to build an AI application that could coordinate multiple information sources and present everything in one place.

## Architecture

The application uses the OpenAI Agents SDK to create an AI agent capable of calling multiple tools. When a user enters their trip information, the agent retrieves flight information, hotel recommendations, and weather forecasts through custom tools built with Next.js API routes. The agent combines the results into structured JSON, which is rendered by the React frontend.

## AI Techniques

- AI Agents
- Tool Calling
- Prompt Engineering
- Structured Outputs

## Technologies

- React
- Next.js
- JavaScript
- OpenAI Agents SDK
- SerpAPI
- Open-Meteo API

## My Contribution

I designed and built the complete application, including the frontend, backend APIs, AI agent, prompt engineering, and deployment.

## Challenges

The largest challenge was ensuring the AI consistently used its tools instead of relying on model knowledge. I refined prompts and response formats until the agent reliably produced structured JSON that could be parsed directly into the frontend.

## What I Learned

This project taught me how to build reliable AI agent workflows and reinforced the importance of prompt engineering and structured outputs when integrating AI into production applications.

# Project page
/singleProject?dataFile=.%2Fapp%2Fdata%2FTravelAgent.json