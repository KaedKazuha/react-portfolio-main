import { Briefcase, FolderKanban, Sparkles } from "lucide-react";

const STAT_ICON_MAP = {
  calendar: Briefcase,
  projects: FolderKanban,
  tech: Sparkles,
};

export function getStatIcon(key) {
  return STAT_ICON_MAP[key] ?? Sparkles;
}
