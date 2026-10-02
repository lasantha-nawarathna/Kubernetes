import type { Metadata } from "next";
import { BadgeCheck, CreditCard, Gift, HandHeart, Lightbulb, Megaphone, Rocket, Search, ShieldCheck, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "How It Works" };

const creatorSteps = [
  { Icon: Lightbulb, title: "Shape your idea", text: "Use our guided builder to write your story, set a goal and design reward tiers." },
  { Icon: BadgeCheck, title: "Get reviewed", text: "Our Trust & Safety team reviews every campaign within 1–2 business days." },
  { Icon: Megaphone, title: "Launch & share", text: "Go live, share with your community and post updates as backers join." },
  { Icon: Rocket, title: "Get funded & deliver", text: "Receive funds within 14 days of success and keep backers in the loop." },
];
const backerSteps = [
  { Icon: Search, title: "Discover", text: "Browse thousands of verified campaigns across 13 categories." },
  { Icon: Gift, title: "Choose a reward", text: "Pick a reward tier — or just give any amount to support the idea." },
  { Icon: CreditCard, title: "Pledge securely", text: "All-or-Nothing pledges are only charged if the campaign succeeds." },
  { Icon: HandHeart, title: "Follow along", text: "Get updates, comment, and receive your reward when it ships." },
];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">How It Works</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">Great ideas, funded by people who care.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">Fundora connects creators with backers. Creators keep full ownership; backers get early access, unique rewards and the joy of making something happen.</p>
        </div>
      </section>
      <Steps title="For creators" steps={creatorSteps} />
      <Steps title="For backers" steps={backerSteps} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] bg-slate-950 p-8 text-white sm:p-12 lg:grid-cols-3">
          {[
            { Icon: ShieldCheck, t: "Fundora Guarantee", d: "If a verified creator fails to deliver, eligible backers can claim a refund of up to €1,000." },
            { Icon: Users, t: "Verified creators", d: "Identity checks, bank verification and a public track record for every creator." },
            { Icon: CreditCard, t: "Simple fees", d: "5% platform fee + payment processing, only when a campaign is funded." },
          ].map(({ Icon, t, d }) => (
            <div key={t}>
              <Icon className="h-8 w-8 text-brand-400" />
              <h3 className="mt-4 text-lg font-bold">{t}</h3>
              <p className="mt-1 text-slate-400">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/start" size="lg">Start a Campaign</ButtonLink>
          <ButtonLink href="/explore" size="lg" variant="outline">Explore Campaigns</ButtonLink>
        </div>
      </section>
    </div>
  );
}

function Steps({ title, steps }: { title: string; steps: typeof creatorSteps }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ Icon, title, text }, i) => (
          <div key={title} className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
            <span className="absolute top-6 right-6 text-5xl font-extrabold text-slate-100">{i + 1}</span>
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white"><Icon className="h-6 w-6" /></span>
            <h3 className="relative mt-5 text-lg font-bold text-slate-900">{title}</h3>
            <p className="relative mt-1 text-slate-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
