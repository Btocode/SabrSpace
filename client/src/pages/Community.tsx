import { Navbar } from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  ArrowBigDown,
  ArrowBigUp,
  BookOpen,
  CalendarDays,
  Crown,
  Hash,
  MapPin,
  MessageCircle,
  PenLine,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";

type QuoteType = "quran" | "hadith" | "islamic";

type Quote = {
  id: string;
  type: QuoteType;
  text: string;
  reference?: string;
};

type BiodataSummary = {
  displayName: string;
  age?: number;
  location?: string;
  lookingFor?: string;
  practicingLevel?: "Learning" | "Practicing" | "Consistent";
  marriageTimeline?: "Soon" | "6-12 months" | "1-2 years";
  highlights: string[];
};

type Author = {
  name: string;
  handle: string;
  avatarUrl?: string;
};

type Comment = {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
};

type CommunityPostType = "question" | "story";

type BasePost = {
  id: string;
  author: Author;
  content: string;
  tags: string[];
  createdAt: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
};

type CommunityPost = BasePost & {
  type: CommunityPostType;
  title?: string;
};

type MatchedBiodata = {
  displayName: string;
  age?: number;
  location?: string;
  practicingLevel?: "Learning" | "Practicing" | "Consistent";
  marriageTimeline?: "Soon" | "6-12 months" | "1-2 years";
  highlights: string[];
};

type BiodataMatchFeedItem = {
  id: string;
  type: "biodata_match";
  createdAt: string;
  matchScore: number; // 0 - 100
  engineName: "Sabr AI";
  promptSummary: string;
  match: MatchedBiodata;
};

type FeedItem = CommunityPost | BiodataMatchFeedItem;

const DEMO_QUOTES: Quote[] = [
  {
    id: "q1",
    type: "quran",
    text: "Indeed, Allah is with the patient.",
    reference: "Qur'an 2:153",
  },
  {
    id: "q2",
    type: "quran",
    text: "So be patient. Indeed, the promise of Allah is truth.",
    reference: "Qur'an 30:60",
  },
  {
    id: "h1",
    type: "hadith",
    text: "How wonderful is the affair of the believer! All of his affairs are good... if he is harmed, he is patient and that is good for him.",
    reference: "Sahih Muslim 2999",
  },
  {
    id: "h2",
    type: "hadith",
    text: "The strong believer is better and more beloved to Allah than the weak believer, while there is good in both.",
    reference: "Sahih Muslim 2664",
  },
  {
    id: "i1",
    type: "islamic",
    text: "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.",
  },
  {
    id: "i2",
    type: "islamic",
    text: "Sabr is a quiet kind of strength — the kind that keeps you upright when life feels heavy.",
  },
];

const DEMO_BIODATA: BiodataSummary = {
  displayName: "Afsan",
  age: 27,
  location: "Dhaka",
  lookingFor: "Marriage",
  practicingLevel: "Practicing",
  marriageTimeline: "6-12 months",
  highlights: [
    "Prioritizes deen + character",
    "Family-oriented, calm communicator",
    "Prefers modest, intentional lifestyle",
  ],
};

const DEMO_POSTS: CommunityPost[] = [
  {
    id: "p1",
    type: "question",
    author: { name: "Hafsa", handle: "@hafsa", avatarUrl: "" },
    title: "How do you stay consistent with salah during busy workdays?",
    content:
      "Some days feel non-stop and I miss my rhythm. What habits helped you protect your salah and keep khushu?",
    tags: ["Salah", "Productivity", "Sabr"],
    createdAt: "2h ago",
    upvotes: 42,
    downvotes: 3,
    comments: [
      {
        id: "c1",
        author: { name: "Omar", handle: "@omar" },
        content:
          "Blocking prayer times on the calendar + making wudu before meetings helped a lot. Also keeping it simple: pray as soon as adhan hits.",
        createdAt: "1h ago",
      },
      {
        id: "c2",
        author: { name: "Zainab", handle: "@zainab" },
        content:
          "I set micro-goals: 2 rakaat sunnah at least. Consistency builds momentum. May Allah make it easy.",
        createdAt: "35m ago",
      },
    ],
  },
  {
    id: "p2",
    type: "question",
    author: { name: "Yusuf", handle: "@yusuf" },
    title: "Any dua you repeat when anxiety spikes?",
    content:
      "I want something short and authentic that I can repeat when my chest feels tight.",
    tags: ["Dua", "Mental Health", "Tawakkul"],
    createdAt: "6h ago",
    upvotes: 30,
    downvotes: 1,
    comments: [
      {
        id: "c1",
        author: { name: "Maryam", handle: "@maryam" },
        content:
          "Hasbunallahu wa ni'mal wakeel. Also: Allahumma inni a'udhu bika minal hammi wal hazan.",
        createdAt: "3h ago",
      },
    ],
  },
  {
    id: "p3",
    type: "story",
    author: { name: "Aisha", handle: "@aisha" },
    content:
      "A small change that helped me: I started doing adhkar right after fajr—even when I felt sleepy. Within a week, my mornings felt calmer and more focused. Not perfect yet, but it feels like barakah in time.",
    tags: ["Story", "Sunnah", "Habits"],
    createdAt: "1d ago",
    upvotes: 61,
    downvotes: 5,
    comments: [],
  },
];

const DEMO_MATCH_ITEMS: BiodataMatchFeedItem[] = [
  {
    id: "m1",
    type: "biodata_match",
    createdAt: "Today",
    matchScore: 92,
    engineName: "Sabr AI",
    promptSummary:
      "Based on your preferences and recent activity, here are a few biodata matches that look promising.",
    match: {
      displayName: "Sana",
      age: 25,
      location: "Dhaka",
      practicingLevel: "Consistent",
      marriageTimeline: "6-12 months",
      highlights: ["Family-oriented", "Hijab", "Prefers simple nikah"],
    },
  },
];

const DEMO_FEED: FeedItem[] = [DEMO_MATCH_ITEMS[0]!, ...DEMO_POSTS];

function QuoteBadge({ type }: { type: QuoteType }) {
  const label = type === "quran" ? "Qur'an" : type === "hadith" ? "Hadith" : "Islamic";

  return (
    <Badge
      className={cn(
        "rounded-full",
        type === "quran" && "bg-primary/10 text-primary border border-primary/20",
        type === "hadith" && "bg-amber-500/10 text-amber-700 border border-amber-500/20",
        type === "islamic" && "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20",
      )}
      variant="outline"
    >
      {label}
    </Badge>
  );
}

function StatPill({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
      <span className="text-primary">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

type FeedFilter =
  | { kind: "all" }
  | { kind: "topic"; topic: string }
  | { kind: "top_posts" }
  | { kind: "top_stories" }
  | { kind: "top_biodatas" };

function getPostScore(item: CommunityPost): number {
  return item.upvotes - item.downvotes + item.comments.length;
}

export default function Community() {
  const [feed, setFeed] = useState<FeedItem[]>(DEMO_FEED);
  const [activeQuoteId, setActiveQuoteId] = useState<string>(DEMO_QUOTES[0]!.id);
  const [composerType, setComposerType] = useState<CommunityPostType>("question");
  const [composerTitle, setComposerTitle] = useState("");
  const [composerBody, setComposerBody] = useState("");
  const [composerTopic, setComposerTopic] = useState("");
  const [composerTopicMode, setComposerTopicMode] = useState<"select" | "custom">("select");
  const [composerTags, setComposerTags] = useState("");
  const [isComposerModalOpen, setIsComposerModalOpen] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<FeedFilter>({ kind: "all" });

  const activeQuote = useMemo(() => {
    return DEMO_QUOTES.find((q) => q.id === activeQuoteId) ?? DEMO_QUOTES[0]!;
  }, [activeQuoteId]);

  const shuffleQuote = () => {
    const next = DEMO_QUOTES[Math.floor(Math.random() * DEMO_QUOTES.length)]!;
    setActiveQuoteId(next.id);
  };

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of feed) {
      if (item.type === "biodata_match") continue;
      for (const tag of item.tags) {
        const key = tag.trim();
        if (!key) continue;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));
  }, [feed]);

  const topStories = useMemo(() => {
    return feed
      .filter((i): i is CommunityPost => i.type !== "biodata_match")
      .filter((p) => p.type === "story")
      .slice()
      .sort((a, b) => getPostScore(b) - getPostScore(a))
      .slice(0, 5);
  }, [feed]);

  const topPosts = useMemo(() => {
    return feed
      .filter((i): i is CommunityPost => i.type !== "biodata_match")
      .slice()
      .sort((a, b) => getPostScore(b) - getPostScore(a))
      .slice(0, 5);
  }, [feed]);

  const topBiodatas = useMemo(() => {
    return feed
      .filter((i): i is BiodataMatchFeedItem => i.type === "biodata_match")
      .slice()
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }, [feed]);

  const visibleFeed = useMemo(() => {
    if (filter.kind === "all") return feed;

    if (filter.kind === "topic") {
      return feed.filter((i) => i.type !== "biodata_match" && i.tags.includes(filter.topic));
    }

    if (filter.kind === "top_posts") {
      const posts = feed
        .filter((i): i is CommunityPost => i.type !== "biodata_match")
        .slice()
        .sort((a, b) => getPostScore(b) - getPostScore(a));
      return posts;
    }

    if (filter.kind === "top_stories") {
      return feed
        .filter((i): i is CommunityPost => i.type !== "biodata_match")
        .filter((p) => p.type === "story")
        .slice()
        .sort((a, b) => getPostScore(b) - getPostScore(a));
    }

    if (filter.kind === "top_biodatas") {
      return feed
        .filter((i): i is BiodataMatchFeedItem => i.type === "biodata_match")
        .slice()
        .sort((a, b) => b.matchScore - a.matchScore);
    }

    return feed;
  }, [feed, filter]);

  const submitPost = () => {
    const title = composerTitle.trim();
    const content = composerBody.trim();
    const topic = composerTopic.trim();
    const extraTags = composerTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (composerType === "question" && (!title || !content)) return;
    if (composerType === "story" && !content) return;

    const allTags = Array.from(
      new Set(
        [
          composerType === "question" ? "Question" : "Story",
          "Sabr Community",
          topic,
          ...extraTags,
        ].filter(Boolean),
      ),
    );

    const newPost: CommunityPost = {
      id: `p_${Date.now()}`,
      type: composerType,
      author: { name: "You", handle: "@you" },
      title: composerType === "question" ? title : undefined,
      content,
      tags: allTags,
      createdAt: "just now",
      upvotes: 0,
      downvotes: 0,
      comments: [],
    };

    setFeed((prev) => [newPost, ...prev]);
    setComposerTitle("");
    setComposerBody("");
    setComposerTopic("");
    setComposerTags("");
    setIsComposerModalOpen(false);
  };

  const vote = (postId: string, direction: "up" | "down") => {
    setFeed((prev) =>
      prev.map((item) => {
        if (item.type === "biodata_match" || item.id !== postId) return item;
        return {
          ...item,
          upvotes: direction === "up" ? item.upvotes + 1 : item.upvotes,
          downvotes: direction === "down" ? item.downvotes + 1 : item.downvotes,
        };
      }),
    );
  };

  const addComment = (postId: string) => {
    const content = (commentDrafts[postId] ?? "").trim();
    if (!content) return;

    setFeed((prev) =>
      prev.map((item) => {
        if (item.type === "biodata_match" || item.id !== postId) return item;
        const newComment: Comment = {
          id: `c_${Date.now()}`,
          author: { name: "You", handle: "@you" },
          content,
          createdAt: "just now",
        };
        return { ...item, comments: [...item.comments, newComment] };
      }),
    );

    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />

      <main className="container mx-auto px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {filter.kind === "topic" ? (
              <Badge variant="secondary" className="rounded-full">
                Topic: {filter.topic}
              </Badge>
            ) : null}
            {filter.kind === "top_posts" ? (
              <Badge variant="secondary" className="rounded-full">
                Top posts
              </Badge>
            ) : null}
            {filter.kind === "top_stories" ? (
              <Badge variant="secondary" className="rounded-full">
                Top stories
              </Badge>
            ) : null}
            {filter.kind === "top_biodatas" ? (
              <Badge variant="secondary" className="rounded-full">
                Top biodatas
              </Badge>
            ) : null}
          </div>

          {filter.kind !== "all" ? (
            <Button variant="ghost" size="sm" onClick={() => setFilter({ kind: "all" })}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8 space-y-6">
            {visibleFeed.map((item) => {
              if (item.type === "biodata_match") {
                const m = item.match;
                return (
                  <Card key={item.id} className="overflow-hidden border-primary/20">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-amber-500/10" />
                        <div className="relative p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className="rounded-full bg-primary text-primary-foreground">
                                  {item.engineName}
                                </Badge>
                                <Badge variant="outline" className="rounded-full">
                                  Matched biodata
                                </Badge>
                                <Badge
                                  className="rounded-full bg-amber-500/15 text-amber-800 border border-amber-500/20"
                                  variant="outline"
                                >
                                  {item.matchScore}% match
                                </Badge>
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                {item.promptSummary}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{item.createdAt}</p>
                              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1 text-xs text-muted-foreground border border-border">
                                <Crown className="h-4 w-4 text-amber-600" />
                                Curated
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="rounded-2xl border border-border bg-white/70 dark:bg-black/20 backdrop-blur-md p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                      <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-foreground">{m.displayName}</p>
                                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        {m.age ? <span>{m.age}</span> : null}
                                        {m.location ? (
                                          <span className="inline-flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {m.location}
                                          </span>
                                        ) : null}
                                        {m.marriageTimeline ? (
                                          <span className="inline-flex items-center gap-1">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            {m.marriageTimeline}
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <Badge
                                  variant="secondary"
                                  className="rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                                >
                                  <span className="inline-flex items-center gap-1">
                                    <ShieldCheck className="h-4 w-4" />
                                    {m.practicingLevel}
                                  </span>
                                </Badge>
                              </div>

                              <div className="mt-3 grid grid-cols-1 gap-2">
                                {m.highlights.map((h) => (
                                  <div key={h} className="flex gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                                    <p className="text-sm text-muted-foreground">{h}</p>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-3 flex justify-end">
                                <Button variant="outline" size="sm">
                                  View biodata
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              const post = item;
              const isExpanded = expandedPostId === post.id;
              const score = post.upvotes - post.downvotes;

              return (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-5">
                      <div className="flex flex-col items-center gap-2 pt-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => vote(post.id, "up")}
                          className="h-9 w-9"
                        >
                          <ArrowBigUp />
                        </Button>
                        <div className="text-sm font-semibold text-foreground">{score}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => vote(post.id, "down")}
                          className="h-9 w-9"
                        >
                          <ArrowBigDown />
                        </Button>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border">
                              <AvatarImage src={post.author.avatarUrl || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {post.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">
                                  {post.author.name}
                                </p>
                                <p className="text-xs text-muted-foreground">{post.author.handle}</p>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "rounded-full",
                                    post.type === "question" && "bg-primary/5 border-primary/20 text-primary",
                                    post.type === "story" && "bg-amber-500/10 border-amber-500/20 text-amber-800",
                                  )}
                                >
                                  {post.type === "question" ? "Question" : "Story"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{post.createdAt}</p>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                            className="text-muted-foreground"
                          >
                            {isExpanded ? "Hide" : "Open"}
                          </Button>
                        </div>

                        {post.type === "question" && post.title ? (
                          <h2 className="mt-3 text-lg font-semibold text-foreground">{post.title}</h2>
                        ) : null}
                        <p className={cn("mt-2 text-sm text-muted-foreground leading-relaxed", post.type === "story" && "text-foreground/80")}>
                          {post.content}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="rounded-full">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments.length} comments</span>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 space-y-3">
                            <div className="rounded-xl border border-border bg-muted/30 p-3">
                              <Textarea
                                value={commentDrafts[post.id] ?? ""}
                                onChange={(e) =>
                                  setCommentDrafts((prev) => ({
                                    ...prev,
                                    [post.id]: e.target.value,
                                  }))
                                }
                                placeholder="Write a kind comment..."
                                className="min-h-[80px] bg-background"
                              />
                              <div className="mt-2 flex justify-end">
                                <Button
                                  size="sm"
                                  onClick={() => addComment(post.id)}
                                  disabled={!(commentDrafts[post.id] ?? "").trim()}
                                >
                                  Comment
                                </Button>
                              </div>
                            </div>

                            {post.comments.length > 0 ? (
                              <div className="space-y-2">
                                {post.comments.map((c) => (
                                  <div
                                    key={c.id}
                                    className="rounded-xl border border-border bg-background/60 p-3"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-foreground">
                                          {c.author.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{c.author.handle}</p>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{c.createdAt}</p>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                      {c.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No comments yet. Be the first to respond.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <aside className="lg:col-span-4 space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-amber-500/10" />
                  <div className="relative p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Share something today</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Ask a question or post a short story — keep it sincere and respectful.
                        </p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <PenLine className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="mt-3">
                      <Button
                        className="w-full"
                        onClick={() => {
                          setComposerType("question");
                          setIsComposerModalOpen(true);
                        }}
                      >
                        Create post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Dialog open={isComposerModalOpen} onOpenChange={setIsComposerModalOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create a post</DialogTitle>
                  <DialogDescription>
                    Choose whether you want to post a question or a story.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Post type</p>
                      <ToggleGroup
                        type="single"
                        value={composerType}
                        onValueChange={(v) => {
                          if (v === "question" || v === "story") setComposerType(v);
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="question" aria-label="Question" className="gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Question
                        </ToggleGroupItem>
                        <ToggleGroupItem value="story" aria-label="Story" className="gap-2">
                          <BookOpen className="h-4 w-4" />
                          Story
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Topic</p>
                      <Select
                        value={composerTopicMode === "select" ? (composerTopic || "__none__") : "__custom__"}
                        onValueChange={(v) => {
                          if (v === "__custom__") {
                            setComposerTopicMode("custom");
                            setComposerTopic("");
                            return;
                          }
                          setComposerTopicMode("select");
                          if (v === "__none__") {
                            setComposerTopic("");
                            return;
                          }
                          setComposerTopic(v);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">No topic</SelectItem>
                          {topics.slice(0, 10).map((t) => (
                            <SelectItem key={t.topic} value={t.topic}>
                              {t.topic}
                            </SelectItem>
                          ))}
                          <SelectItem value="__custom__">Custom topic…</SelectItem>
                        </SelectContent>
                      </Select>

                      {composerTopicMode === "custom" ? (
                        <Input
                          value={composerTopic}
                          onChange={(e) => setComposerTopic(e.target.value)}
                          placeholder={topics[0]?.topic ? `e.g. ${topics[0].topic}` : "e.g. Marriage"}
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Tags (comma separated)</p>
                    <Input
                      value={composerTags}
                      onChange={(e) => setComposerTags(e.target.value)}
                      placeholder="e.g. Sabr, Dua, Anxiety"
                    />
                  </div>

                  {composerType === "question" ? (
                    <Input
                      value={composerTitle}
                      onChange={(e) => setComposerTitle(e.target.value)}
                      placeholder="Your question title..."
                    />
                  ) : null}

                  <Textarea
                    value={composerBody}
                    onChange={(e) => setComposerBody(e.target.value)}
                    placeholder={
                      composerType === "question"
                        ? "Share context so others can help..."
                        : "Share your story (keep it respectful and sincere)..."
                    }
                    className="min-h-[140px]"
                  />
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsComposerModalOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitPost}
                    disabled={
                      composerType === "question"
                        ? !composerTitle.trim() || !composerBody.trim()
                        : !composerBody.trim()
                    }
                  >
                    Post
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Top topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topics.length > 0 ? (
                  topics.slice(0, 8).map((t) => (
                    <button
                      key={t.topic}
                      onClick={() => setFilter({ kind: "topic", topic: t.topic })}
                      className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-left text-sm hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-foreground">
                          <Hash className="h-4 w-4 text-primary" />
                          {t.topic}
                        </span>
                        <span className="text-xs text-muted-foreground">{t.count}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No topics yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Top biodatas</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setFilter({ kind: "top_biodatas" })}>
                    View
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {topBiodatas.length > 0 ? (
                  topBiodatas.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setFilter({ kind: "top_biodatas" })}
                      className="w-full rounded-xl border border-border bg-gradient-to-br from-primary/5 via-background to-amber-500/5 px-3 py-2 text-left hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{b.match.displayName}</span>
                        <span className="text-xs text-muted-foreground">{b.matchScore}%</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {b.match.location ?? ""}{b.match.practicingLevel ? ` • ${b.match.practicingLevel}` : ""}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No biodata matches yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Top posts</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setFilter({ kind: "top_posts" })}>
                    View
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {topPosts.length > 0 ? (
                  topPosts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setFilter({ kind: "top_posts" });
                        setExpandedPostId(p.id);
                      }}
                      className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-left hover:bg-muted/40 transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {p.type === "question" ? p.title : p.content}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {getPostScore(p)} interactions
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No posts yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Top stories</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setFilter({ kind: "top_stories" })}>
                    View
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {topStories.length > 0 ? (
                  topStories.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setFilter({ kind: "top_stories" });
                        setExpandedPostId(p.id);
                      }}
                      className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-left hover:bg-muted/40 transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground line-clamp-2">{p.content}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {getPostScore(p)} interactions
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No stories yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">Today’s reminder</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">Randomized from demo data.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={shuffleQuote}>
                    Shuffle
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <QuoteBadge type={activeQuote.type} />
                  {activeQuote.reference ? (
                    <p className="text-xs text-muted-foreground">{activeQuote.reference}</p>
                  ) : null}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">“{activeQuote.text}”</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
