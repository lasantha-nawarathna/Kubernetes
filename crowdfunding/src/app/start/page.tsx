import type { Metadata } from "next";
import { CampaignWizard } from "@/components/start/CampaignWizard";

export const metadata: Metadata = { title: "Start a Campaign" };

export default function StartPage() {
  return <CampaignWizard />;
}
