import { Brain, Code2, LineChart, Sparkles } from "lucide-react";

const iconMap = {
  code: Code2,
  brain: Brain,
  chart: LineChart,
  sparkles: Sparkles,
};

export function getAboutIcon(name) {
  return iconMap[name] || Sparkles;
}
