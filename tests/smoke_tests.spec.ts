import { test, expect, type Page } from '@playwright/test';

// Keep direct page and API requests aligned with Playwright's local or production target.
const baseURL = `${(process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')}/`;

// Provide repeatable workflow data without calling GitHub from page or navigation checks.
async function stubWorkflowRuns(page: Page) {
  await page.route('**/api/github-runs', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ workflow_runs: [{
      id: 1,
      name: 'CI',
      status: 'completed',
      conclusion: 'success',
      html_url: 'https://github.com/Matthew-Stormblessed/my-portfolio/actions/runs/1',
      created_at: '2026-01-01T00:00:00Z',
    }] }),
  }));
}

// Return a Vercel AI SDK UI-message stream so assistant tests never call the live chat service.
async function stubAssistantReply(
  page: Page,
  reply: string,
  sources?: Array<{ id: string; title: string; url: string }>,
  onRequest?: (payload: unknown, contentType: string | undefined) => void,
) {
  await page.route('**/api/chat', (route) => {
    // Capture the browser request so its JSON shape can be checked against ChatMessage's UIMessage contract.
    onRequest?.(route.request().postDataJSON(), route.request().headers()['content-type']);
    const events = [
      { type: 'start', messageId: 'mock-assistant-reply', ...(sources ? { messageMetadata: { sources } } : {}) },
      { type: 'text-start', id: 'mock-text' },
      { type: 'text-delta', id: 'mock-text', delta: reply },
      { type: 'text-end', id: 'mock-text' },
      { type: 'finish', finishReason: 'stop' },
    ];
    return route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      headers: { 'x-vercel-ai-ui-message-stream': 'v1', 'cache-control': 'no-cache' },
      body: events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('') + 'data: [DONE]\n\n',
    });
  });
}

// Seed browser storage before the assistant effect reads it during the first page load.
async function seedSavedConversation(page: Page, serializedConversation: string) {
  await page.addInitScript((value) => localStorage.setItem('aiconvo', value), serializedConversation);
}

test('home page shows the portfolio introduction and assistant welcome', async ({ page }) => {
  await page.goto(baseURL);

  await expect(page).toHaveTitle(/Matthew Johnson/);
  await expect(page.getByRole('heading', { name: 'Software Engineer' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Featured Work' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ask My AI Assistant' }).first()).toBeVisible();
  await expect(page.getByText(/Hi! I'm Matthew's AI assistant\./)).toBeVisible();
  await expect(page.getByText(/Questions and replies are stored/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'What technologies does Matthew work with?' })).toBeVisible();
});

test('About page shows experience and education', async ({ page }) => {
  await page.goto(`${baseURL}About`);

  await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sorenson Communications' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Weber State University' })).toBeVisible();
});

test('Projects page lists the featured projects', async ({ page }) => {
  await page.goto(`${baseURL}projects`);

  await expect(page.getByRole('heading', { name: 'My projects' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI Portfolio Assistant' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'PopChoice — AI Movie Recommender' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI Travel Planner' })).toBeVisible();
});

test('GitHub Actions page shows workflow runs', async ({ page }) => {
  // Stub the page's GitHub proxy so this smoke check stays deterministic and makes no external request.
  await stubWorkflowRuns(page);

  await page.goto(`${baseURL}actions`);

  await expect(page.getByRole('heading', { name: 'GitHub Actions' })).toBeVisible();
  await expect(page.getByText('Latest GitHub Action runs for this portfolio repository.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'CI — completed (success)' })).toBeVisible();
});

test('Certificates page shows current credentials', async ({ page }) => {
  await page.goto(`${baseURL}certificates`);

  await expect(page.getByRole('heading', { name: 'Certifications' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The AI Engineer Path' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Learn React' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Learn AI Agents' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Learn Context Engineering' })).toBeVisible();
});

test('primary navbar exposes each internal page', async ({ page }) => {
  await page.goto(baseURL);

  for (const [label, href] of [
    ['Home', '/'],
    ['About', '/About'],
    ['Projects', '/projects'],
    ['Certificates', '/certificates'],
    ['Contact', '/Contact'],
    ['GitHub Actions', '/actions'],
  ]) {
    await expect(page.getByRole('link', { name: label }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: label }).first()).toHaveAttribute('href', href);
  }

  // Verify external profile destinations without navigating to third-party sites.
  await expect(page.getByRole('link', { name: 'GitHub profile' })).toHaveAttribute('href', 'https://github.com/Matthew-Stormblessed');
  await expect(page.getByRole('link', { name: 'LinkedIn profile' })).toHaveAttribute('href', 'https://www.linkedin.com/in/matthew-johnson-950631152');
  for (const profile of [page.getByRole('link', { name: 'GitHub profile' }), page.getByRole('link', { name: 'LinkedIn profile' })]) {
    await expect(profile).toHaveAttribute('target', '_blank');
    await expect(profile).toHaveAttribute('rel', /noopener/);
  }
});

for (const [label, path] of [
  ['About', 'About'],
  ['Projects', 'projects'],
  ['Certificates', 'certificates'],
  ['Contact', 'Contact'],
  ['GitHub Actions', 'actions'],
] as const) {
  test(`navbar navigates to ${label}`, async ({ page }) => {
    // Visiting Actions runs a client fetch, so stub its data here as well as in its content test.
    if (label === 'GitHub Actions') await stubWorkflowRuns(page);
    await page.goto(baseURL);
    await page.getByRole('link', { name: label }).first().click();
    await expect(page).toHaveURL(`${baseURL}${path}`);
  });
}

test('navbar returns to Home from an interior page', async ({ page }) => {
  await page.goto(`${baseURL}About`);
  await page.getByRole('link', { name: 'Home' }).first().click();
  await expect(page).toHaveURL(baseURL);
});

test('Contact page shows current contact methods', async ({ page }) => {
  await page.goto(`${baseURL}Contact`);

  await expect(page.getByRole('heading', { name: "Let's Connect" })).toBeVisible();
  await expect(page.getByText(/If you're looking to collaborate or have questions about my work/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'matthewisaacjohnson@gmail.com' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'matthewisaacjohnson@gmail.com' })).toHaveAttribute('href', 'mailto:matthewisaacjohnson@gmail.com');
  await expect(page.getByRole('link', { name: '+1 (385) 243-4677' })).toBeVisible();
  await expect(page.getByRole('link', { name: '+1 (385) 243-4677' })).toHaveAttribute('href', 'tel:+13852434677');
  await expect(page.getByRole('link', { name: 'github.com/Matthew-Stormblessed' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'github.com/Matthew-Stormblessed' })).toHaveAttribute('href', 'https://github.com/Matthew-Stormblessed');
  await expect(page.getByRole('link', { name: 'linkedin.com/in/matthew-johnson-950631152' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'linkedin.com/in/matthew-johnson-950631152' })).toHaveAttribute('href', 'https://www.linkedin.com/in/matthew-johnson-950631152');
});

for (const title of [
  'AI Portfolio Assistant',
  'PopChoice — AI Movie Recommender',
  'AI Travel Planner',
] as const) {
  test(`project card opens the ${title} details`, async ({ page }) => {
    await page.goto(`${baseURL}projects`);
    // Click the accessible card so the check covers the real list-to-detail user journey.
    await page.getByRole('link', { name: `View details for ${title}` }).click();

    await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Challenges & engineering details' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tech stack' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Source code' }).first()).toHaveAttribute('target', '_blank');
    await expect(page.getByRole('link', { name: 'Source code' }).first()).toHaveAttribute('rel', /noopener/);
    await expect(page.getByRole('link', { name: 'Live demo' }).first()).toHaveAttribute('target', '_blank');
    await expect(page.getByRole('link', { name: '← Back to projects' }).first()).toHaveAttribute('href', '/projects');
  });
}

test('unknown project data shows a recoverable not-found state', async ({ page }) => {
  await page.goto(`${baseURL}singleProject?dataFile=not-a-project.json`);

  await expect(page.getByRole('heading', { name: 'Project not found' })).toBeVisible();
  await expect(page.getByText(/select a valid project/i)).toBeVisible();
});

test('featured project thumbnail assets load successfully', async ({ page }) => {
  await page.goto(`${baseURL}projects`);
  const thumbnails = page.locator('img[alt$=" screenshot"]');
  await expect(thumbnails).toHaveCount(3);

  for (const thumbnail of await thumbnails.all()) {
    await thumbnail.scrollIntoViewIfNeeded();
    // naturalWidth distinguishes a loaded image from an image element whose request failed.
    await expect.poll(() => thumbnail.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
});

test('mobile menu opens, navigates, and closes after a selection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL);

  const toggle = page.getByRole('button', { name: 'Toggle menu' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  const mobileMenu = page.locator('#mobile-menu');
  await expect(mobileMenu.getByRole('link', { name: 'Projects' })).toBeVisible();
  await mobileMenu.getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(`${baseURL}projects`);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('contact and credential links point to working local assets', async ({ page }) => {
  await page.goto(`${baseURL}Contact`);
  const resumeLink = page.getByRole('link', { name: 'View Resume' });
  await expect(resumeLink).toHaveAttribute('href', '/MatthewJohnson_Resume.pdf');
  const resumeResponse = await page.request.get(new URL('/MatthewJohnson_Resume.pdf', baseURL).toString());
  expect(resumeResponse.status()).toBe(200);
  expect(resumeResponse.headers()['content-type']).toContain('application/pdf');

  await page.goto(`${baseURL}certificates`);
  // Confirm every credential target resolves locally without opening tabs or contacting outside services.
  const credentialHrefs = await page.getByRole('link', { name: 'View credential' }).evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).getAttribute('href')),
  );
  expect(credentialHrefs).toHaveLength(4);
  for (const href of credentialHrefs) {
    expect(href).toMatch(/^\/certificates\/.+\.pdf$/);
    const response = await page.request.get(new URL(href!, baseURL).toString());
    expect(response.status(), `${href} should resolve to a local PDF`).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
  }
});

test('assistant sends a representative question and renders a Markdown response and source', async ({ page }) => {
  await stubAssistantReply(page, 'Matthew builds with **Next.js** and *TypeScript*.\n\n- Portfolio assistant\n- Travel planner', [
    { id: 'portfolio', title: 'Portfolio project', url: 'https://example.test/portfolio' },
  ]);
  await page.goto(baseURL);

  const input = page.getByPlaceholder("Ask about Matthew's experience, projects, or skills...");
  await input.fill('Which technologies does Matthew use?');
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.getByText('Which technologies does Matthew use?')).toBeVisible();
  await expect(page.locator('strong', { hasText: 'Next.js' })).toBeVisible();
  await expect(page.locator('em', { hasText: 'TypeScript' })).toBeVisible();
  await expect(page.getByRole('list').filter({ has: page.getByText('Portfolio assistant') })).toBeVisible();
  await page.getByRole('button', { name: 'Sources ▼' }).click();
  const source = page.getByRole('link', { name: 'Portfolio project' });
  await expect(source).toHaveAttribute('href', 'https://example.test/portfolio');
  await expect(source).toHaveAttribute('rel', /noopener/);
});

test('assistant sends JSON messages matching the ChatMessage structure', async ({ page }) => {
  let payload: unknown;
  let contentType: string | undefined;
  await stubAssistantReply(page, 'The request shape is valid.', undefined, (body, requestContentType) => {
    payload = body;
    contentType = requestContentType;
  });
  await page.goto(baseURL);
  await page.getByPlaceholder("Ask about Matthew's experience, projects, or skills...").fill('Check the chat request structure.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('The request shape is valid.')).toBeVisible();

  expect(contentType).toContain('application/json');
  expect(payload).toBeTruthy();
  const messages = (payload as { messages?: unknown }).messages;
  expect(Array.isArray(messages)).toBe(true);
  expect((messages as unknown[]).length).toBeGreaterThan(0);
  for (const candidate of messages as Array<Record<string, unknown>>) {
    // ChatMessage is UIMessage<ChatMessageMetadata>: each message has id, role, and parts.
    expect(Object.keys(candidate).sort()).toEqual(['id', 'parts', 'role']);
    expect(typeof candidate.id).toBe('string');
    expect(['user', 'assistant']).toContain(candidate.role);
    expect(Array.isArray(candidate.parts)).toBe(true);
    for (const part of candidate.parts as Array<Record<string, unknown>>) {
      expect(Object.keys(part).sort()).toEqual(['text', 'type']);
      expect(part.type).toBe('text');
      expect(typeof part.text).toBe('string');
    }
  }
  expect((messages as Array<{ role: string; parts: Array<{ text: string }> }>)
    .some((message) => message.role === 'user' && message.parts.some((part) => part.text === 'Check the chat request structure.'))).toBe(true);
});

test('assistant conversation persists across reload and New chat resets it', async ({ page }) => {
  await stubAssistantReply(page, 'A mocked answer about Matthew’s projects.');
  await page.goto(baseURL);
  await page.getByPlaceholder("Ask about Matthew's experience, projects, or skills...").fill('Tell me about his projects.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('A mocked answer about Matthew’s projects.')).toBeVisible();

  await expect.poll(() => page.evaluate(() => localStorage.getItem('aiconvo'))).toContain('Tell me about his projects.');
  await page.reload();
  await expect(page.getByText('Tell me about his projects.')).toBeVisible();
  await expect(page.getByText('A mocked answer about Matthew’s projects.')).toBeVisible();

  await page.getByRole('button', { name: 'New chat' }).click();
  await expect(page.getByText(/Hi! I'm Matthew's AI assistant\./)).toBeVisible();
  await expect(page.getByText('Tell me about his projects.')).toHaveCount(0);
  // The persistence effect stores the welcome turn; verify all conversation turns were removed.
  await expect.poll(async () => page.evaluate(() => {
    const stored = localStorage.getItem('aiconvo');
    return stored ? JSON.parse(stored).messages.length : 0;
  })).toBe(1);
});

test('assistant discards an expired saved conversation and restores its welcome state', async ({ page }) => {
  await seedSavedConversation(page, JSON.stringify({
    expiry: Date.now() - 1,
    messages: [
      { id: 'old-user-turn', role: 'user', parts: [{ type: 'text', text: 'This conversation has expired.' }] },
      { id: 'old-assistant-turn', role: 'assistant', parts: [{ type: 'text', text: 'An expired answer.' }] },
    ],
  }));
  await page.goto(baseURL);

  await expect(page.getByText(/Hi! I'm Matthew's AI assistant\./)).toBeVisible();
  await expect(page.getByText('This conversation has expired.')).toHaveCount(0);
  await expect(page.getByText('An expired answer.')).toHaveCount(0);
  await expect.poll(async () => page.evaluate(() => {
    const value = localStorage.getItem('aiconvo');
    return value ? JSON.parse(value).messages.length : 0;
  })).toBe(1);
});

for (const [caseName, malformedValue] of [
  ['invalid JSON text', '{not-json'],
  ['invalid conversation envelope', JSON.stringify({ expiry: Date.now() + 60_000, messages: { role: 'assistant' } })],
] as const) {
  test(`assistant recovers from ${caseName} in saved storage`, async ({ page }) => {
    await seedSavedConversation(page, malformedValue);
    await page.goto(baseURL);

    await expect(page.getByRole('heading', { name: 'Ask My AI Assistant', level: 3 })).toBeVisible();
    await expect(page.getByText(/Hi! I'm Matthew's AI assistant\./)).toBeVisible();
    // Confirm recovery left valid state behind so future reloads can still restore the chat UI.
    await expect.poll(async () => page.evaluate(() => {
      const value = localStorage.getItem('aiconvo');
      if (!value) return false;
      try {
        const parsed = JSON.parse(value);
        return parsed.expiry > Date.now() && Array.isArray(parsed.messages) && parsed.messages.length === 1;
      } catch {
        return false;
      }
    })).toBe(true);
  });
}

test('assistant rejects questions over 1000 characters without sending them', async ({ page }) => {
  let requestCount = 0;
  await page.route('**/api/chat', (route) => {
    requestCount += 1;
    return route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"Unexpected request"}' });
  });
  await page.goto(baseURL);
  const input = page.getByPlaceholder("Ask about Matthew's experience, projects, or skills...");
  await input.fill('x'.repeat(1001));
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.getByText('Please keep questions under 1000 characters')).toBeVisible();
  await expect(input).toHaveValue('');
  expect(requestCount).toBe(0);
});

test('assistant does not submit empty or whitespace-only input from the button or Enter key', async ({ page }) => {
  let requestCount = 0;
  await page.route('**/api/chat', (route) => {
    requestCount += 1;
    return route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"Unexpected request"}' });
  });
  await page.goto(baseURL);
  const input = page.getByPlaceholder("Ask about Matthew's experience, projects, or skills...");
  const sendButton = page.getByRole('button', { name: 'Send message' });

  // Exercise both supported send actions because either one could accidentally bypass blank-input validation.
  await sendButton.click();
  await input.press('Enter');
  await input.fill('   \t  ');
  await sendButton.click();
  await input.press('Enter');

  expect(requestCount).toBe(0);
  await expect.poll(async () => page.evaluate(() => {
    const stored = localStorage.getItem('aiconvo');
    return stored ? JSON.parse(stored).messages.length : 0;
  })).toBe(1);
});

test('assistant shows a recoverable error when the chat service fails', async ({ page }) => {
  // Simulate an upstream outage at the browser boundary; no chat provider or email tool is contacted.
  await page.route('**/api/chat', (route) => route.fulfill({
    status: 503,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'Chat service temporarily unavailable' }),
  }));
  await page.goto(baseURL);
  await page.getByPlaceholder("Ask about Matthew's experience, projects, or skills...").fill('What projects has Matthew built?');
  await page.getByRole('button', { name: 'Send message' }).click();

  // Assert the visible error and restored controls instead of coupling to SDK wording.
  const errorMessage = page.locator('.text-red-600').filter({ hasText: /.+/ });
  await expect(errorMessage).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled();
  await expect(page.getByText('...')).toHaveCount(0);

  // Replace the failed mock with a successful stream to prove retry recovers the same chat session.
  await page.unroute('**/api/chat');
  await stubAssistantReply(page, 'The retry succeeded.');
  await page.getByPlaceholder("Ask about Matthew's experience, projects, or skills...").fill('Please retry this question.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('The retry succeeded.')).toBeVisible();
});

test('assistant shows a recoverable rate-limit response', async ({ page }) => {
  // Return the documented API limit response without consuming Redis quota or calling any provider.
  await page.route('**/api/chat', (route) => route.fulfill({
    status: 429,
    contentType: 'application/json',
    headers: { 'retry-after': '60', 'x-ratelimit-limit': '20', 'x-ratelimit-remaining': '0' },
    body: JSON.stringify({ error: 'You have sent too many messages. Please try again shortly.' }),
  }));
  await page.goto(baseURL);
  await page.getByPlaceholder("Ask about Matthew's experience, projects, or skills...").fill('A question while rate limited.');
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.locator('.text-red-600').filter({ hasText: /.+/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled();
});

test('assistant reports a provider failure delivered inside the response stream', async ({ page }) => {
  const events = [
    { type: 'start', messageId: 'partial-assistant-reply' },
    { type: 'text-start', id: 'partial-text' },
    { type: 'text-delta', id: 'partial-text', delta: 'A partial answer before failure.' },
    { type: 'error', errorText: 'The assistant could not complete this response. Please try again.' },
  ];
  // Simulate the AI SDK's stream error chunk after partial text without calling the model provider.
  await page.route('**/api/chat', (route) => route.fulfill({
    status: 200,
    contentType: 'text/event-stream',
    headers: { 'x-vercel-ai-ui-message-stream': 'v1', 'cache-control': 'no-cache' },
    body: events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('') + 'data: [DONE]\n\n',
  }));
  await page.goto(baseURL);
  await page.getByPlaceholder("Ask about Matthew's experience, projects, or skills...").fill('Please stream an answer.');
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.getByText(/could not complete this response/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled();
});

test('GitHub Actions displays loading, empty, and failed request states', async ({ page }) => {
  let releaseResponse!: () => void;
  const responseGate = new Promise<void>((resolve) => { releaseResponse = resolve; });
  await page.route('**/api/github-runs', async (route) => {
    await responseGate;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ workflow_runs: [] }),
    });
  });
  await page.goto(`${baseURL}actions`);
  await expect(page.getByText('Loading GitHub Actions...')).toBeVisible();
  releaseResponse();
  await expect(page.getByText('No workflow runs found.')).toBeVisible();

  await page.unroute('**/api/github-runs');
  await page.route('**/api/github-runs', (route) => route.fulfill({ status: 502, body: 'mock upstream failure' }));
  await page.reload();
  await expect(page.getByText(/Unable to load workflow runs/)).toBeVisible();
});

test('chat API rejects malformed and out-of-bounds requests before external work', async ({ request }) => {
  const url = `${baseURL}api/chat`;
  const cases: Array<{ name: string; body?: string; status: number; error: string }> = [
    { name: 'empty request body', status: 400, error: 'Invalid JSON body.' },
    { name: 'malformed JSON', body: '{', status: 400, error: 'Invalid JSON body.' },
    { name: 'XML instead of the documented JSON payload', body: '<messages><message>hello</message></messages>', status: 400, error: 'Invalid JSON body.' },
    { name: 'missing messages', body: JSON.stringify({}), status: 400, error: 'Invalid chat history.' },
    { name: 'empty history', body: JSON.stringify({ messages: [] }), status: 400, error: 'Invalid chat history.' },
    { name: 'history over 100 messages', body: JSON.stringify({ messages: Array.from({ length: 101 }, () => ({ role: 'user', parts: [] })) }), status: 400, error: 'Invalid chat history.' },
    { name: 'invalid role', body: JSON.stringify({ messages: [{ role: 'system', parts: [{ type: 'text', text: 'Nope' }] }] }), status: 400, error: 'Invalid chat message.' },
    { name: 'missing parts', body: JSON.stringify({ messages: [{ role: 'user' }] }), status: 400, error: 'Invalid chat message.' },
    { name: 'more than 20 parts', body: JSON.stringify({ messages: [{ role: 'user', parts: Array.from({ length: 21 }, () => ({ type: 'text', text: 'x' })) }] }), status: 400, error: 'Invalid chat message.' },
    { name: 'question over limit', body: JSON.stringify({ messages: [{ role: 'user', parts: [{ type: 'text', text: 'x'.repeat(1001) }] }] }), status: 400, error: 'Invalid chat message.' },
    { name: 'assistant response over limit', body: JSON.stringify({ messages: [{ role: 'assistant', parts: [{ type: 'text', text: 'x'.repeat(8001) }] }] }), status: 400, error: 'Invalid chat message.' },
    { name: 'body over request budget', body: JSON.stringify({ messages: [{ role: 'user', parts: [{ type: 'text', text: 'x'.repeat(32_001) }] }] }), status: 413, error: 'Request is too large.' },
  ];

  for (const scenario of cases) {
    const response = await request.post(url, {
      ...(scenario.body === undefined ? {} : { data: Buffer.from(scenario.body) }),
      // Send raw bytes as JSON so malformed JSON/XML cases reach the route without Playwright re-encoding them.
      headers: { 'content-type': 'application/json' },
    });
    expect(response.status(), scenario.name).toBe(scenario.status);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = await response.json();
    expect(Object.keys(responseBody).sort(), scenario.name).toEqual(['error']);
    expect(responseBody.error, scenario.name).toBe(scenario.error);
  }
});
