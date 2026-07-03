import { Briefcase, FolderKanban, Smartphone, Sparkles } from "lucide-react";

const STAT_ICON_MAP = {
  calendar: Briefcase,
  projects: FolderKanban,
  mobile: Smartphone,
  tech: Sparkles,
};

export function getStatIcon(key) {
  return STAT_ICON_MAP[key] ?? Sparkles;
}
