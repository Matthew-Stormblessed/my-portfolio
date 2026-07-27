---
sourceType: project
sourceTitle: AI Portfolio Assistant
sourceUrl: /singleProject?dataFile=.%2Fapp%2Fdata%2FPortfolioAssistant.json
keywords:
  - project
  - portfolio
  - chatbot
  - AI
  - recruiter
  - RAG
  - retrieval augmented generation
  - semantic search
  - embeddings
  - vector database
  - Supabase
  - pgvector
  - OpenAI
  - Vercel AI SDK
  - streaming
  - markdown
  - prompt engineering
  - source attribution
  - prompt injection
  - Next.js
  - React
---

# AI Portfolio Assistant

## Overview

The AI Portfolio Assistant is a retrieval-augmented generation (RAG) chatbot built into Matthew Johnson's portfolio website. It allows recruiters and hiring managers to ask natural language questions about Matthew's experience, projects, education, technical skills, and career goals.

Rather than relying on the language model's training data, the assistant retrieves relevant information from a curated knowledge base generated directly from Matthew's portfolio. This ensures responses remain accurate, grounded, and up to date.

## Problem

Recruiters often need to quickly determine whether a candidate has experience with a particular technology or project. Traditional portfolios require navigating multiple pages to find this information.

The AI Portfolio Assistant provides a conversational interface that allows recruiters to ask questions naturally and receive immediate, evidence-based responses.

## Architecture

The application follows a Retrieval-Augmented Generation (RAG) architecture.

Workflow:

1. A recruiter submits a question through the React chat interface.
2. The backend generates an embedding for the user's question using the OpenAI Embeddings API.
3. The embedding is compared against a Supabase pgvector database containing embedded portfolio documents.
4. The most relevant document chunks are retrieved through semantic similarity search.
5. The retrieved context is supplied to GPT-5 Nano using the Vercel AI SDK.
6. The model generates a grounded response using only the retrieved portfolio information.
7. The response is streamed to the frontend and rendered as Markdown with source attribution.

## Technologies Used

Frontend

- React
- Next.js
- JavaScript
- Tailwind CSS
- React Markdown

AI

- OpenAI API
- GPT-5 Nano
- OpenAI Embeddings
- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Prompt Engineering

Backend

- Next.js API Routes
- Vercel AI SDK
- Streaming Responses

Database

- Supabase
- PostgreSQL
- pgvector

## My Contributions

Matthew designed and implemented the entire application.

Responsibilities included:

- Designing the RAG architecture
- Building the React chat interface
- Creating the knowledge base used for retrieval
- Generating and storing vector embeddings
- Implementing semantic similarity search
- Building the streaming backend using the Vercel AI SDK
- Rendering streamed Markdown responses
- Adding source attribution for retrieved documents
- Implementing suggested recruiter questions
- Adding conversation persistence
- Implementing rate limiting
- Improving prompt reliability through prompt engineering

## Engineering Challenges

One challenge was ensuring the assistant consistently retrieved the correct portfolio information for broad questions.

To improve retrieval quality Matthew:

- Refined document chunking
- Added metadata and keywords to knowledge documents
- Tuned vector similarity search
- Improved retrieval prompts
- Added overview documents for broad topics

Another challenge was ensuring responses remained grounded in retrieved information rather than relying on the model's prior knowledge.

To address this Matthew:

- Implemented source attribution
- Added prompt-injection protections
- Required responses to use retrieved context
- Prevented the assistant from inventing qualifications or experience

## Features

The assistant currently supports:

- Questions about work experience
- Questions about technical skills
- Questions about AI projects
- Questions about education
- Questions about career interests
- Streaming AI responses
- Markdown formatting
- Suggested recruiter questions
- Source citations
- Conversation persistence
- Rate limiting

## What This Project Demonstrates

This project demonstrates experience with:

- Building production AI applications
- Retrieval-Augmented Generation (RAG)
- Embeddings
- Semantic Search
- Vector Databases
- Prompt Engineering
- AI Streaming
- React
- Next.js
- API Design
- Full-stack application architecture

# Project page
/singleProject?dataFile=.%2Fapp%2Fdata%2FPortfolioAssistant.json