"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, CreditCard, Gift, Heart, Loader2, Lock, PartyPopper, Share2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatMoney, getCampaign, getRewards } from "@/lib/data";
import { cn } from "@/lib/cn";

type Step = "choose" | "review" | "processing" | "done";
const QUICK_AMOUNTS = [10, 25, 50, 100, 250];

export function ContributionModal({ target, onClose }: { target: { campaignId: string; rewardId?: string } | null; onClose: () => void }) {
  const campaign = target ? getCampaign(target.campaignId) : undefined;
  const rewards = useMemo(() => (campaign ? getRewards(campaign) : []), [campaign]);

  const [step, setStep] = useState<Step>("choose");
  const [rewardId, setRewardId] = useState<string>("none");
  const [amount, setAmount] = useState(25);
  const [anonymous, setAnonymous] = useState(false);
  const [tip, setTip] = useState(true);

  useEffect(() => {
    if (!target) return;
    setStep("choose");
    setAnonymous(false);
    const r = rewards.find((x) => x.id === target.rewardId);
    setRewardId(r ? r.id : "none");
    setAmount(r ? r.amount : 25);
  }, [target, rewards]);

  if (!campaign) return null;

  const reward = rewards.find((r) => r.id === rewardId);
  const minAmount = reward?.amount ?? 1;
  const valid = amount >= minAmount;
  const tipAmount = tip ? Math.round(amount * 0.05) : 0;
  const shipping = reward && reward.shipsTo ? 8 : 0;
  const total = amount + tipAmount + shipping;

  const selectReward = (id: string) => {
    setRewardId(id);
    const r = rewards.find((x) => x.id === id);
    if (r && amount < r.amount) setAmount(r.amount);
  };

  const confirm = () => {
    setStep("processing");
    setTimeout(() => setStep("done"), 1400);
  };

  const header = (
    <div className="flex items-center gap-3">
      <SmartImage src={campaign.image} alt={campaign.title} width={160} className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">You&apos;re supporting</p>
        <p className="truncate text-sm font-bold text-slate-900">{campaign.title}</p>
      </div>
    </div>
  );

  return (
    <Modal
      open={!!target}
      onClose={onClose}
      size="lg"
      title={step === "done" ? undefined : step === "review" ? "Review your contribution" : "Back this project"}
      description={step === "choose" ? "Choose a reward or simply contribute any amount." : step === "review" ? "This is a prototype — no payment will be taken." : undefined}
      footer={
        step === "choose" ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Your contribution</p>
              <p className="text-xl font-bold text-slate-900">{formatMoney(amount || 0)}</p>
            </div>
            <Button size="lg" disabled={!valid} onClick={() => setStep("review")}>
              Continue
            </Button>
          </div>
        ) : step === "review" ? (
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => setStep("choose")}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button size="lg" onClick={confirm}>
              <Lock className="h-4 w-4" /> Confirm {formatMoney(total)}
            </Button>
          </div>
        ) : undefined
      }
    >
      {step === "choose" && (
        <div className="space-y-6">
          {header}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Select a reward</h3>
            <div className="space-y-2.5">
              <RewardOption
                selected={rewardId === "none"}
                onSelect={() => selectReward("none")}
                title="Contribute without a reward"
                subtitle="Back it because you believe in it."
                price="Any amount"
              />
              {rewards.map((r) => {
                const left = r.limit ? r.limit - r.backers : null;
                return (
                  <RewardOption
                    key={r.id}
                    selected={rewardId === r.id}
                    onSelect={() => selectReward(r.id)}
                    title={r.title}
                    subtitle={r.items.join(" · ")}
                    price={`${formatMoney(r.amount)}+`}
                    meta={`Est. delivery ${r.delivery}${left !== null ? ` · ${left.toLocaleString()} left` : ""}`}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Contribution amount</h3>
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  disabled={a < minAmount}
                  onClick={() => setAmount(a)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
                    amount === a ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-700 hover:border-slate-300",
                  )}
                >
                  {formatMoney(a)}
                </button>
              ))}
            </div>
            <div className="relative mt-3">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-lg font-semibold text-slate-400">€</span>
              <input
                type="number"
                min={minAmount}
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="h-14 w-full rounded-2xl border border-slate-200 pr-4 pl-10 text-xl font-bold text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                aria-label="Custom amount"
              />
            </div>
            {!valid && <p className="mt-2 text-sm text-rose-600">The minimum for this reward is {formatMoney(minAmount)}.</p>}
          </div>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
            <label className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Contribute anonymously</p>
                <p className="text-sm text-slate-500">Your name won&apos;t appear on the public backers list.</p>
              </div>
              <Switch checked={anonymous} onChange={setAnonymous} label="Contribute anonymously" />
            </label>
            <label className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Add a 5% tip to Fundora</p>
                <p className="text-sm text-slate-500">Helps keep the platform free for creators.</p>
              </div>
              <Switch checked={tip} onChange={setTip} label="Add a tip" />
            </label>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-5">
          {header}
          <div className="rounded-2xl bg-slate-50 p-5">
            <Row label="Reward" value={reward ? reward.title : "No reward"} />
            <Row label="Contribution" value={formatMoney(amount)} />
            {shipping > 0 && <Row label="Shipping (estimated)" value={formatMoney(shipping)} />}
            {tipAmount > 0 && <Row label="Platform tip" value={formatMoney(tipAmount)} />}
            <Row label="Visibility" value={anonymous ? "Anonymous" : "Public"} />
            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="text-xl font-bold text-slate-900">{formatMoney(total)}</span>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Payment method</h3>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-brand-600 bg-brand-50/40 p-4">
              <CreditCard className="h-5 w-5 text-brand-700" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">Visa ending in 4242</p>
                <p className="text-xs text-slate-500">Demo card · Expires 08/29</p>
              </div>
              <Check className="h-5 w-5 text-brand-600" />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <Lock className="h-3.5 w-3.5" />
              {campaign.fundingType === "All-or-Nothing"
                ? "All-or-Nothing: you'll only be charged if this project reaches its goal."
                : "Flexible Funding: your contribution is processed immediately."}
            </p>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
          <p className="mt-4 font-semibold text-slate-900">Processing your contribution…</p>
          <p className="text-sm text-slate-500">This is a simulated payment.</p>
        </div>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center py-8 text-center animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-brand-200 opacity-60" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-teal-400 text-white shadow-lg shadow-brand-500/30">
              <PartyPopper className="h-9 w-9" />
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Thank you for supporting this campaign.</h2>
          <p className="mt-2 max-w-md text-slate-500">
            Your {formatMoney(total)} contribution to <span className="font-semibold text-slate-700">{campaign.title}</span> has been recorded.
            {reward && <> You selected the <span className="font-semibold text-slate-700">{reward.title}</span> reward.</>}
          </p>
          <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-3 text-left">
            <MiniStat icon={<Heart className="h-4 w-4" />} label="Backer #" value={(campaign.backers + 1).toLocaleString()} />
            <MiniStat icon={<Gift className="h-4 w-4" />} label="Reward" value={reward ? reward.title : "None"} />
            <MiniStat icon={<Lock className="h-4 w-4" />} label="Receipt" value="#FD-48213" />
          </div>
          <div className="mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <Button className="flex-1" onClick={onClose}>
              Done
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              <Share2 className="h-4 w-4" /> Share campaign
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function RewardOption({
  selected,
  onSelect,
  title,
  subtitle,
  price,
  meta,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
  price: string;
  meta?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition",
        selected ? "border-brand-600 bg-brand-50/50" : "border-slate-200 hover:border-slate-300",
      )}
    >
      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2", selected ? "border-brand-600 bg-brand-600" : "border-slate-300")}>
        {selected && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="font-semibold text-slate-900">{title}</span>
          <span className="shrink-0 text-sm font-bold text-brand-700">{price}</span>
        </span>
        <span className="mt-0.5 block text-sm text-slate-500">{subtitle}</span>
        {meta && <span className="mt-1 block text-xs text-slate-400">{meta}</span>}
      </span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="flex items-center gap-1 text-xs text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-1 truncate text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}
