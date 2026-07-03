const assetModules = import.meta.glob("../assets/**/*", {
  eager: true,
  query: "?url",
  import: "default",
});

function normalizeAssetPath(path) {
  return path.replace(/\\/g, "/").replace(/^\.\//, "");
}

export function getAssetUrl(path) {
  if (!path) return null;

  const normalized = normalizeAssetPath(path);
  const moduleKey = `../assets/${normalized}`;

  if (assetModules[moduleKey]) {
    return assetModules[moduleKey];
  }

  return `${import.meta.env.BASE_URL}assets/${normalized}`;
}

export const getImageUrl = getAssetUrl;

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
