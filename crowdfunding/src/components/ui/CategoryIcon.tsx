import {
  Clapperboard,
  Cpu,
  Gamepad2,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Leaf,
  Music,
  Palette,
  PenTool,
  Rocket,
  Users,
  UtensilsCrossed,
  type LucideProps,
} from "lucide-react";

const map = { Clapperboard, Cpu, Gamepad2, GraduationCap, HandHeart, HeartPulse, Leaf, Music, Palette, PenTool, Rocket, Users, UtensilsCrossed };

export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = map[name as keyof typeof map] ?? Rocket;
  return <Icon {...props} />;
}
