import { Navbar } from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  ArrowBigDown,
  ArrowBigUp,
  MessageCircle,
  Sparkles,
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

type Post = {
  id: string;
  author: Author;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
};

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

const DEMO_POSTS: Post[] = [
  {
    id: "p1",
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
    author: { name: "Aisha", handle: "@aisha" },
    title: "Small deeds that changed your day?",
    content:
      "Share 1 small sunnah or habit that gave you barakah and calmness recently.",
    tags: ["Sunnah", "Habits"],
    createdAt: "1d ago",
    upvotes: 61,
    downvotes: 5,
    comments: [],
  },
];

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

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS);
  const [activeQuoteId, setActiveQuoteId] = useState<string>(DEMO_QUOTES[0]!.id);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const activeQuote = useMemo(() => {
    return DEMO_QUOTES.find((q) => q.id === activeQuoteId) ?? DEMO_QUOTES[0]!;
  }, [activeQuoteId]);

  const shuffleQuote = () => {
    const next = DEMO_QUOTES[Math.floor(Math.random() * DEMO_QUOTES.length)]!;
    setActiveQuoteId(next.id);
  };

  const submitQuestion = () => {
    const title = questionTitle.trim();
    const content = questionBody.trim();

    if (!title || !content) return;

    const newPost: Post = {
      id: `p_${Date.now()}`,
      author: { name: "You", handle: "@you" },
      title,
      content,
      tags: ["Sabr Community"],
      createdAt: "just now",
      upvotes: 0,
      downvotes: 0,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setQuestionTitle("");
    setQuestionBody("");
  };

  const vote = (postId: string, direction: "up" | "down") => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          upvotes: direction === "up" ? p.upvotes + 1 : p.upvotes,
          downvotes: direction === "down" ? p.downvotes + 1 : p.downvotes,
        };
      }),
    );
  };

  const addComment = (postId: string) => {
    const content = (commentDrafts[postId] ?? "").trim();
    if (!content) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const newComment: Comment = {
          id: `c_${Date.now()}`,
          author: { name: "You", handle: "@you" },
          content,
          createdAt: "just now",
        };
        return { ...p, comments: [...p.comments, newComment] };
      }),
    );

    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sabr Community</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask questions, share reflections, and support each other with kindness.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatPill icon={<Sparkles className="h-4 w-4" />}>Daily reminders</StatPill>
              <StatPill icon={<MessageCircle className="h-4 w-4" />}>Thoughtful replies</StatPill>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8 space-y-6">
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Post a question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="What’s on your mind?"
                />
                <Textarea
                  value={questionBody}
                  onChange={(e) => setQuestionBody(e.target.value)}
                  placeholder="Share context so others can help..."
                  className="min-h-[110px]"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Demo only — posting is local state for now.
                  </p>
                  <Button onClick={submitQuestion} disabled={!questionTitle.trim() || !questionBody.trim()}>
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {posts.map((post) => {
              const isExpanded = expandedPostId === post.id;

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
                        <div className="text-sm font-semibold text-foreground">
                          {post.upvotes - post.downvotes}
                        </div>
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

                        <h2 className="mt-3 text-lg font-semibold text-foreground">
                          {post.title}
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
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
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">Today’s reminder</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Randomized from demo data.
                    </p>
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
                <p className="text-sm leading-relaxed text-foreground/90">
                  “{activeQuote.text}”
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your biodata summary</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Demo summary shown in your feed.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {DEMO_BIODATA.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(DEMO_BIODATA.age ? `${DEMO_BIODATA.age} • ` : "") +
                        (DEMO_BIODATA.location ?? "")}
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    {DEMO_BIODATA.practicingLevel}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-border bg-muted/30 p-2">
                    <p className="text-muted-foreground">Looking for</p>
                    <p className="mt-1 font-medium text-foreground">
                      {DEMO_BIODATA.lookingFor}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-2">
                    <p className="text-muted-foreground">Timeline</p>
                    <p className="mt-1 font-medium text-foreground">
                      {DEMO_BIODATA.marriageTimeline}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {DEMO_BIODATA.highlights.map((h) => (
                    <div key={h} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <p className="text-sm text-muted-foreground">{h}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Community etiquette</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Keep it sincere and respectful.</p>
                <p>Avoid public judgment; advise gently.</p>
                <p>Assume good intentions and make dua for each other.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
