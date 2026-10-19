-- Store each latest question and completed answer so the site owner can review real chat usage.
create table if not exists public.chat_transcripts (
  -- Give each interaction a server-generated identifier for safe log correlation.
  request_id uuid primary key,
  -- Keep the user's latest question so the owner can inspect what visitors ask.
  question text not null,
  -- Keep the answer the stream delivered so the owner can assess response quality.
  answer text not null default '',
  -- Distinguish successful, interrupted, and failed generations during review.
  status text not null check (status in ('completed', 'failed', 'aborted')),
  -- Preserve end-to-end latency to reveal slow model or dependency calls.
  duration_ms integer not null check (duration_ms >= 0),
  -- Store only a broad failure category instead of raw exception content.
  error_category text,
  -- Timestamp each interaction so usage can be reviewed chronologically.
  created_at timestamptz not null default now(),
  -- Expire transcripts after 90 days to limit retention of visitor-provided text.
  expires_at timestamptz not null default (now() + interval '90 days')
);

-- Enable row security so browser clients cannot access conversation text.
alter table public.chat_transcripts enable row level security;

-- Remove API access for public and signed-in browser roles because transcripts contain user-entered text.
revoke all on table public.chat_transcripts from public, anon, authenticated;

-- Allow only the server-side service role to write and query transcripts for owner review.
grant select, insert on table public.chat_transcripts to service_role;

-- Index newest interactions so dashboard review by date remains responsive as rows accumulate.
create index if not exists chat_transcripts_created_at_idx on public.chat_transcripts (created_at desc);

-- After enabling pg_cron in Supabase, run this once to enforce the 90-day expiry automatically:
-- select cron.schedule('purge-chat-transcripts', '17 3 * * *', $$delete from public.chat_transcripts where expires_at <= now()$$);
