


# Complete Guide: Production-Grade Sabr Community (DB + Backend + AI Engine)

## 0) Best backend choice (my recommendation)

Given:
- You already use **Supabase auth**
- You want **public visibility** (readable without login)
- Interactions require accounts (write/vote/comment gated)
- You want to move fast, but still be secure

**Recommended architecture: Supabase-first**
- **Supabase Postgres** = source of truth
- **RLS** (row-level security) = core security
- **SQL migrations** for schema
- **RPC SQL functions** for atomic actions (voting, ranking)
- **Edge Functions** for AI generation tasks + scheduled jobs
- **Storage** for any assets later
- Optional: add a lightweight Node API later only if complexity demands it

Why this is “best” here:
- **Security by default** (RLS prevents client tampering)
- **Fastest implementation** with your existing stack
- Handles “public read, private write” extremely well
- Edge Functions are perfect for “generate AI content, store it, serve it”

---

# 1) Requirements mapping (what we’re building)

## Public vs authenticated behavior
- **Public**:
  - Can view `/community`
  - Can view posts, comments counts, AI featured items
- **Authenticated only**:
  - Create post
  - Comment
  - Vote
  - Bookmark/report/hide
  - See personalized biodata matches (optional privacy)

This drives your RLS policies.

---

# 2) Database schema (core community)

Below is a solid schema that supports:
- questions + stories
- tags/topics
- comments
- upvotes/downvotes
- moderation + reports
- future features like bookmarks

## 2.1 Tables

### `community_posts`
- `id uuid pk default gen_random_uuid()`
- `author_id uuid null`  
  - nullable if you allow AI/system posts
- `author_type text not null default 'user'`  
  - values: `user|ai|system`
- `type text not null`  
  - `question|story|feature` (feature = AI featured post)
- `title text null`
- `content text not null`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`
- `is_deleted boolean default false`
- `is_hidden boolean default false`
- `is_locked boolean default false`
- `metadata jsonb default '{}'::jsonb`  
  - store extra AI provenance, language, etc.

### `community_comments`
- `id uuid pk default gen_random_uuid()`
- `post_id uuid not null references community_posts(id)`
- `author_id uuid not null references auth.users(id)`
- `content text not null`
- `created_at timestamptz default now()`
- `is_deleted boolean default false`
- `is_hidden boolean default false`

### `community_votes`
- `post_id uuid not null references community_posts(id)`
- `user_id uuid not null references auth.users(id)`
- `value smallint not null` (`-1` or `+1`)
- `created_at timestamptz default now()`
- **primary key** (`post_id`, `user_id`) to ensure one vote per user

### Tags/topics (2 styles)
You can do either:

#### Style A (simpler): “tags are just strings”
- Store `tags text[]` in `community_posts`
- Pros: simplest
- Cons: weaker indexing/analytics at scale

#### Style B (recommended): normalized topics + tags
- `community_topics(id, name unique)`
- `community_tags(id, name unique)`
- join tables:
  - `community_post_topics(post_id unique, topic_id)`
  - `community_post_tags(post_id, tag_id)`

This is better for:
- “top topics”
- consistent naming
- indexing

### `community_reports`
- `id uuid pk`
- `reporter_id uuid references auth.users(id)`
- `target_type text` (`post|comment`)
- `target_id uuid`
- `reason text`
- `created_at timestamptz default now()`
- `status text default 'open'` (`open|reviewed|dismissed|actioned`)

### `community_bookmarks` (optional)
- `post_id uuid references community_posts(id)`
- `user_id uuid references auth.users(id)`
- `created_at timestamptz default now()`
- pk (`post_id`, `user_id`)

## 2.2 Indexes
- `community_posts(created_at desc)`
- `community_posts(is_hidden, is_deleted, created_at desc)`
- `community_comments(post_id, created_at)`
- `community_votes(post_id)`, `community_votes(user_id)`
- `community_topics(name) unique`, `community_tags(name) unique`

---

# 3) RLS policies (public read, auth-only write)

## Key rule
Enable RLS on all tables. Then explicitly allow:
- `SELECT` for everyone where content is not hidden/deleted
- `INSERT/UPDATE/DELETE` for authenticated, scoped to ownership

### Posts
- **SELECT**: allow `anon` + `authenticated` where `is_hidden=false AND is_deleted=false`
- **INSERT**: only `authenticated`
- **UPDATE/DELETE**: only `author_id = auth.uid()` (and not locked), or `role=admin`

### Comments
- **SELECT**: allow public where parent post is visible and comment not hidden/deleted
- **INSERT**: authenticated only
- **UPDATE/DELETE**: only comment author or admin

### Votes
- **SELECT**: public is fine if you expose vote totals separately; otherwise authenticated only
- **INSERT/UPDATE/DELETE**: authenticated only AND `user_id = auth.uid()`

### Reports
- **INSERT**: authenticated
- **SELECT**: admin only

**Admin model:** simplest is to create a `profiles` table with `is_admin boolean`, or use Supabase custom claims.

---

# 4) Backend behavior (RPC + Edge Functions)

## 4.1 Feed querying (fast + correct)
You want feed items:
- regular posts
- AI featured posts
- biodata match cards (personal or global)

### Approach
- Use a **SQL VIEW** to unify feed items, OR fetch separately and merge in client.

Recommended:
- `community_posts` covers user + AI posts.
- `ai_feed_items` covers biodata-match cards (see AI section).

Then:
- `rpc_get_feed(filter, cursor, limit)` returns the feed list and aggregated counts.

## 4.2 Atomic vote toggling (RPC)
Voting should be single-call and race-safe:
- If user clicks upvote:
  - if existing upvote -> remove vote
  - if existing downvote -> switch to upvote
  - else insert upvote

Create RPC: `rpc_vote_post(post_id, value)` where value is `+1` or `-1`.

It returns updated totals:
- upvotes
- downvotes
- score

This avoids inconsistent counts.

## 4.3 Aggregations for sidebar
Create RPCs:
- `rpc_top_topics(limit)`
- `rpc_top_posts(limit, window_days)`
- `rpc_top_stories(limit, window_days)`
- `rpc_top_biodatas(limit, window_days)` (based on interactions)

---

# 5) AI engine design (biodata + featured posts + AI-written posts)

You said:
- AI won’t just post biodata
- It will feature posts
- Sometimes it will write posts

So think of “AI engine” as **3 outputs**:

## Output A: Personalized biodata matches (private)
Shown as cards in feed, but should usually be visible only to logged-in user (privacy).

### Core components
- **Biodata table** (profiles)
- **Embedding store** (pgvector)
- **Match generation** job
- **Storage of generated matches** (so feed is stable and debuggable)

### Tables (AI)
#### `biodata_profiles`
- `id uuid pk`
- structured fields
- `summary_text text` (for embedding)
- consent/visibility fields (critical)

#### `biodata_embeddings`
- `profile_id uuid pk references biodata_profiles(id)`
- `embedding vector(1536)` (example)
- index for ANN search

#### `ai_matches`
- `id uuid pk`
- `viewer_user_id uuid references auth.users(id)` (nullable if public/global)
- `matched_profile_id uuid references biodata_profiles(id)`
- `match_score int`
- `prompt_summary text`
- `created_at timestamptz`
- `provenance jsonb` (model, prompt hash, safety flags)

#### `ai_match_interactions`
- `match_id uuid`
- `user_id uuid`
- `action text` (`upvote|downvote|hide|bookmark`)
- unique(match_id, user_id, action) or model differently

### Generation flow
- When user opens `/community`:
  - client calls edge function `ensure_matches(user_id)`
  - function checks if user has fresh matches in last N hours
  - if not, it:
    - builds query representation (from user preferences/profile)
    - embeds query
    - vector search top K biodatas
    - writes `ai_matches` rows

**Important:** always store provenance so you can debug “why did AI show this?”

---

## Output B: AI “featured post” (public or semi-public)
These are AI-curated content pieces: “This is trending”, “Reflection”, “Guidance post”.

### Implementation
Store them directly in `community_posts` with:
- `author_type = 'ai'`
- `type = 'feature'` or `story`
- `metadata.provenance` containing model + guardrails + source signals

### How to generate
- Daily scheduled edge function:
  - reads trending topics/posts
  - asks the model to write a “featured reflection”
  - runs a safety+policy filter
  - inserts into `community_posts`

---

## Output C: AI-written posts (occasionally)
These should be clearly labeled, and ideally cite sources.

### Rules to keep it safe
- **Always label** as AI-authored
- Keep tone: supportive, not issuing absolute fatwas
- If it references Quran/Hadith:
  - include reference fields
  - consider a curated database rather than free-generation

### Suggested structure
Add in `community_posts.metadata`:
- `metadata.ai = { model, prompt_hash, safety: {passed:boolean, categories:[]}, created_by: 'edge_function_name' }`
- `metadata.sources = [{type:'quran|hadith|scholar', reference:'...', url:'...'}]`

---

# 6) Visibility rules (public read, gated interactions)

## Public read
- Community posts: public read allowed by RLS.
- Comments: public read allowed by RLS (only non-hidden, non-deleted).
- Votes: you can expose aggregated counts publicly:
  - either computed view: `post_vote_totals`
  - or store cached counts (harder)

## Gated interactions
- Insert post/comment/vote requires auth.
- For anonymous visitors:
  - show CTA: “Sign in to post, vote, comment”

---

# 7) Frontend integration strategy (safe migration from demo)

## 7.1 Replace local demo feed with server feed
- Create a `useCommunityFeed()` hook:
  - fetch feed with pagination
  - supports filters: topic/top_posts/top_stories/top_biodatas
- Use optimistic updates for:
  - creating posts
  - voting
  - adding comments

## 7.2 Keep the current UI
Your current UI can remain almost unchanged:
- The modal composer calls “create post” API instead of local state
- Votes call RPC
- Comments call insert + refetch or optimistic append

## 7.3 Pagination
Do keyset pagination:
- `cursor = { created_at, id }`
- prevents duplicates and scales better than offset.

---

# 8) Deployment + environments (do it properly)

## Environments
- `dev`
- `staging`
- `prod`

## Migration flow
- Keep migrations in `supabase/migrations`
- Always apply to staging first
- Seed staging with demo-like content

## Secrets
- AI keys only in:
  - Supabase Edge Function secrets
  - never in client

---

# 9) Moderation + anti-spam (minimum needed)

## Must-have protections
- Rate limit:
  - posts per minute per user
  - comments per minute per user
- `reports` table + admin review UI
- ability to:
  - hide post/comment (`is_hidden`)
  - lock post (`is_locked`)
  - shadowban user (optional)

## Observability
- Log AI generation events with:
  - job_id
  - inputs hash
  - outputs hash
  - safety result

---

# 10) Recommended implementation order (do this in phases)

## Phase 1: Core community (real posts)
- Build schema + RLS
- Create post / comment / vote RPC
- Read feed publicly

## Phase 2: Rankings + sidebar
- top queries + filters
- caching strategy if needed

## Phase 3: AI feed items
- biodata tables + embeddings
- match generation edge function
- store and display `ai_matches`

## Phase 4: AI featured + AI-written posts
- scheduled function to generate curated content
- provenance + safety gates

## Phase 5: Moderation + hardening
- reports, admin tools, rate limiting

---

# Concrete next step (so we can proceed without guessing)
Answer these and I’ll turn this guide into an execution checklist with exact SQL/RPC names and recommended policies:

- **What AI stack are you planning** (OpenAI, local model, Claude, etc.)?
- **Do biodata profiles contain sensitive data** (location/age)? If yes, biodata matches should almost certainly be **authenticated-only**, even if the community is public.
- Do you want **AI featured posts** to be:
  - fully public
  - or only visible to logged-in users?

## Status
- Complete end-to-end guide provided (backend recommendation + AI engine design + public-read/auth-write security model).