import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignDetail } from "@/components/campaign/CampaignDetail";
import { campaigns, getCampaign } from "@/lib/data";

export function generateStaticParams() {
  return campaigns.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = getCampaign(id);
  return { title: c?.title ?? "Campaign", description: c?.tagline };
}

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) notFound();
  return <CampaignDetail campaign={campaign} />;
}
