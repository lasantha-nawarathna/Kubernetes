import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
      <p className="text-7xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">This page wandered off</h1>
      <p className="mt-2 text-slate-500">The campaign or page you&apos;re looking for doesn&apos;t exist or has ended.</p>
      <ButtonLink href="/explore" className="mt-8">
        <Compass className="h-4 w-4" /> Explore campaigns
      </ButtonLink>
    </div>
  );
}
