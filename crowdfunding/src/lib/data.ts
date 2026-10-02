import campaignsJson from "@/data/campaigns.json";
import categoriesJson from "@/data/categories.json";
import creatorsJson from "@/data/creators.json";
import type { Campaign, Category, Creator, Reward } from "./types";

export const campaigns = campaignsJson as Campaign[];
export const categories = categoriesJson as Category[];
export const creators = creatorsJson as Creator[];

/** Build an Unsplash CDN URL from a photo id. */
export function img(id: string, w = 1200) {
  if (!id) return "";
  if (id.startsWith("http") || id.startsWith("blob:") || id.startsWith("data:")) return id;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export function getCampaign(id: string) {
  return campaigns.find((c) => c.id === id);
}

export function getCreator(id: string) {
  return creators.find((c) => c.id === id) as Creator;
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function categoryName(slug: string) {
  return getCategory(slug)?.name ?? slug;
}

export const countries = Array.from(new Set(campaigns.map((c) => c.country))).sort();

const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export function formatMoney(n: number) {
  return eur.format(n);
}

export function compactNumber(n: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function percentFunded(c: { raised: number; goal: number }) {
  return c.goal > 0 ? Math.round((c.raised / c.goal) * 100) : 0;
}

/* ------------------------------------------------------------------ */
/* Derived mock content: rewards, FAQ, updates, comments, backers      */
/* ------------------------------------------------------------------ */

const isCause = (c: Campaign) => ["charity", "medical", "community", "education", "environment"].includes(c.category);

export function getRewards(c: Campaign): Reward[] {
  const product = c.title.split(/[—-]/)[0].trim();
  if (isCause(c)) {
    return [
      { id: "r1", amount: 10, title: "Supporter", description: "Every euro makes a difference. Join our community of supporters.", items: ["Personal thank-you message", "Campaign updates"], delivery: "December 2026", backers: Math.round(c.backers * 0.38), limit: null },
      { id: "r2", amount: 49, title: "Champion", description: "Help us go further, faster — and see exactly where your money goes.", items: ["Everything in Supporter", "Exclusive behind-the-scenes updates", "Digital impact report"], delivery: "February 2027", backers: Math.round(c.backers * 0.34), limit: null },
      { id: "r3", amount: 99, title: "Founding Friend", description: "Your name permanently listed among the people who made this possible.", items: ["Everything in Champion", "Name on our Founders' Wall", "Limited-edition tote bag"], delivery: "February 2027", backers: Math.round(c.backers * 0.2), limit: 500 },
      { id: "r4", amount: 500, title: "Patron", description: "A transformative gift with a personal visit or video call from the team.", items: ["Everything in Founding Friend", "Private video call with the team", "Framed thank-you print"], delivery: "March 2027", backers: Math.round(c.backers * 0.02), limit: 40 },
    ];
  }
  return [
    { id: "r1", amount: 10, title: "Supporter", description: "Not ready for the full reward? Back us and follow the journey.", items: ["Thank-you message", "Campaign updates"], delivery: "December 2026", backers: Math.round(c.backers * 0.12), limit: null },
    { id: "r2", amount: 49, title: "Early Supporter", description: `Get ${product} at our lowest ever early supporter price.`, items: [`1× ${product} (early supporter price)`, "Exclusive updates", "Backer-only Discord access"], delivery: "February 2027", backers: Math.round(c.backers * 0.46), limit: 1500, shipsTo: "Ships worldwide" },
    { id: "r3", amount: 99, title: "Premium Supporter", description: "The premium version with every upgrade, in collector packaging.", items: [`1× ${product} Premium edition`, "Limited-edition packaging", "Name listed as supporter"], delivery: "February 2027", backers: Math.round(c.backers * 0.31), limit: 800, shipsTo: "Ships worldwide" },
    { id: "r4", amount: 249, title: "Founding Backer", description: "Two premium units, early beta access and a call with the founders.", items: [`2× ${product} Premium edition`, "Beta access 3 months early", "Founders video call"], delivery: "January 2027", backers: Math.round(c.backers * 0.05), limit: 100, shipsTo: "Ships worldwide" },
  ];
}

export function getFaqs(c: Campaign) {
  return [
    { q: "When will I be charged?", a: c.fundingType === "All-or-Nothing" ? "This is an All-or-Nothing campaign. Your card is only charged if the campaign reaches its goal by the deadline." : "This campaign uses Flexible Funding, so your contribution is processed immediately and the creator keeps funds even if the goal isn't met." },
    { q: "Do you ship internationally?", a: "Yes. Physical rewards ship worldwide. Shipping costs are calculated at checkout based on your location; EU orders include VAT." },
    { q: "Can I change my reward after backing?", a: "You can change or cancel your pledge at any time before the campaign ends from your Backed Campaigns dashboard." },
    { q: "What happens if the project is delayed?", a: "We publish an update at least every two weeks. If delivery slips by more than three months, every backer will be offered a full refund." },
    { q: `How will the ${formatMoney(c.goal)} be used?`, a: "The full funding breakdown is listed in the Campaign tab. We will publish receipts for major expenses in our updates." },
  ];
}

export function getUpdates(c: Campaign) {
  return [
    { id: 4, title: "We're past " + percentFunded(c) + "% — thank you!", date: "29 Sep 2026", excerpt: `In just ${Math.max(5, 40 - c.daysLeft)} days, ${c.backers.toLocaleString()} of you have joined us. Here's what's next, and a sneak peek at our stretch goals.`, likes: 214, comments: 38 },
    { id: 3, title: "Behind the scenes: meet the team", date: "20 Sep 2026", excerpt: "We invited a few backers into our workshop last weekend. Here's a short video tour and answers to your most common questions.", likes: 156, comments: 22 },
    { id: 2, title: "Prototype testing results", date: "11 Sep 2026", excerpt: "We've completed three rounds of independent testing. The results exceeded our targets — full report inside.", likes: 98, comments: 17 },
    { id: 1, title: "We're live!", date: c.launched.split("-").reverse().join("/"), excerpt: "After two years of work, our campaign is finally live. Thank you to the first 100 backers who joined us in the first hour.", likes: 341, comments: 64 },
  ];
}

export const sampleComments = [
  { name: "Anna Lindqvist", avatar: "1544005313-94ddf0286df2", time: "2 hours ago", text: "Just backed at the Premium tier — the updates have been so transparent. Can't wait!", backer: true, likes: 12 },
  { name: "Marco Bianchi", avatar: "1506794778202-cad84cf45f1d", time: "5 hours ago", text: "Will there be an EU plug adapter included in the box?", backer: true, likes: 4, reply: "Yes! Every EU order ships with the correct adapter. — The team" },
  { name: "Priya Nair", avatar: "1573496359142-b8d87734a5a2", time: "Yesterday", text: "Love the attention to detail in the campaign story. The funding breakdown makes it easy to trust.", backer: true, likes: 9 },
  { name: "James Okafor", avatar: "1500648767791-00dcc994a43e", time: "2 days ago", text: "Any plans for stretch goals once you pass 100%?", backer: false, likes: 3 },
];

export const sampleBackers = [
  { name: "Anna Lindqvist", avatar: "1544005313-94ddf0286df2", amount: 99, time: "4 min ago", location: "Stockholm, SE" },
  { name: "Anonymous", avatar: "", amount: 250, time: "18 min ago", location: "—" },
  { name: "Tomás Rivera", avatar: "1506794778202-cad84cf45f1d", amount: 49, time: "32 min ago", location: "Madrid, ES" },
  { name: "Priya Nair", avatar: "1573496359142-b8d87734a5a2", amount: 249, time: "1 hr ago", location: "London, UK" },
  { name: "Lukas Becker", avatar: "1500648767791-00dcc994a43e", amount: 49, time: "2 hr ago", location: "Munich, DE" },
  { name: "Chloé Dubois", avatar: "1534528741775-53994a69daeb", amount: 10, time: "3 hr ago", location: "Lyon, FR" },
  { name: "Anonymous", avatar: "", amount: 49, time: "3 hr ago", location: "—" },
  { name: "Kenji Watanabe", avatar: "1507003211169-0a1dd7228f2d", amount: 99, time: "5 hr ago", location: "Osaka, JP" },
];

export function getTimeline(c: Campaign) {
  return [
    { date: "Q1 2026", title: "Research & concept", text: "Interviews with 200+ potential users and first sketches.", done: true },
    { date: "Q2 2026", title: "Working prototype", text: "Functional prototypes built and tested with early users.", done: true },
    { date: "Q3 2026", title: "Crowdfunding launch", text: `Launch on Fundora with a ${formatMoney(c.goal)} goal.`, done: true },
    { date: "Q4 2026", title: "Production partners", text: "Finalise suppliers, tooling and quality assurance.", done: false },
    { date: "Q1 2027", title: "Delivery to backers", text: "First rewards ship and the project goes live.", done: false },
  ];
}

export function getBreakdown(c: Campaign) {
  return isCause(c)
    ? [
        { label: "Programme delivery", pct: 62, color: "bg-emerald-500" },
        { label: "Equipment & supplies", pct: 21, color: "bg-sky-500" },
        { label: "Reporting & transparency", pct: 7, color: "bg-amber-500" },
        { label: "Platform & payment fees", pct: 10, color: "bg-slate-400" },
      ]
    : [
        { label: "Manufacturing & tooling", pct: 48, color: "bg-emerald-500" },
        { label: "Research & development", pct: 20, color: "bg-sky-500" },
        { label: "Shipping & fulfilment", pct: 14, color: "bg-violet-500" },
        { label: "Marketing & community", pct: 8, color: "bg-amber-500" },
        { label: "Platform & payment fees", pct: 10, color: "bg-slate-400" },
      ];
}

export const teamMembers = [
  { name: "Lead & Founder", role: "Vision, strategy and backer communication", avatar: "1438761681033-6461ffad8d80" },
  { name: "Engineering Lead", role: "Prototyping, testing and production", avatar: "1500648767791-00dcc994a43e" },
  { name: "Operations", role: "Suppliers, logistics and fulfilment", avatar: "1534528741775-53994a69daeb" },
  { name: "Community", role: "Updates, support and events", avatar: "1506794778202-cad84cf45f1d" },
];

/* ------------------------------------------------------------------ */
/* Analytics series (deterministic pseudo-random)                      */
/* ------------------------------------------------------------------ */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function getAnalytics(raised: number, backers: number, goal: number, seed = 7) {
  const rand = seeded(seed);
  const days = 30;
  // Front- and back-loaded curve, typical for crowdfunding
  const weights = Array.from({ length: days }, (_, i) => {
    const launch = Math.exp(-i / 3) * 4;
    const mid = 0.6 + rand() * 0.6;
    const spike = i === 14 || i === 22 ? 1.6 : 0;
    return launch + mid + spike;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let cumRaised = 0;
  let cumBackers = 0;
  const start = new Date("2026-09-02");
  return weights.map((w, i) => {
    const amount = Math.round((w / total) * raised);
    const b = Math.max(1, Math.round((w / total) * backers));
    cumRaised += amount;
    cumBackers += b;
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      day: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      amount,
      backers: b,
      cumulative: cumRaised,
      cumulativeBackers: cumBackers,
      goal,
      views: Math.round(amount * (2.2 + rand())),
    };
  });
}

export const trafficSources = [
  { name: "Direct", value: 32 },
  { name: "Social media", value: 28 },
  { name: "Fundora search", value: 18 },
  { name: "Email", value: 12 },
  { name: "Press & blogs", value: 10 },
];
