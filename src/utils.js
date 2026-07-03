export const getImageUrl = (path) => {
  if (!path) return null;
  return new URL(`../../assets/${path}`, import.meta.url).href;
};

export function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getPlaceholderGradient(seed = "") {
  const palettes = [
    ["#f472b6", "#e879f9"],
    ["#e879f9", "#a78bfa"],
    ["#fda4af", "#818cf8"],
    ["#f0abfc", "#818cf8"],
    ["#a78bfa", "#6366f1"],
  ];
  const index = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palettes[index % palettes.length];
}
