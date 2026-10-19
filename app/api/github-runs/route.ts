import { NextResponse } from "next/server";

// Cache GitHub's public workflow feed for five minutes to reduce repeat upstream requests.
export const revalidate = 300;

export async function GET() {
  // Keep any optional GitHub credential on the server instead of exposing it in the browser bundle.
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Restrict this proxy to the portfolio's fixed repository so it cannot be used as a general fetch endpoint.
  const response = await fetch("https://api.github.com/repos/Matthew-Stormblessed/my-portfolio/actions/runs?per_page=10", {
    headers,
    next: { revalidate: 300 },
  });
  if (!response.ok) return NextResponse.json({ error: "Failed to fetch workflow runs." }, { status: 502 });

  // Return only the fields rendered by the page so the public proxy exposes no unnecessary GitHub data.
  const data = await response.json();
  const workflowRuns = (data.workflow_runs ?? []).map((run: Record<string, unknown>) => ({
    id: run.id,
    name: run.name,
    status: run.status,
    conclusion: run.conclusion,
    html_url: run.html_url,
    created_at: run.created_at,
  }));
  return NextResponse.json({ workflow_runs: workflowRuns }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
