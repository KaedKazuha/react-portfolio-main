const SKILL_ICON_MAP = {
  React: "skills/react.png",
  HTML: "skills/html.png",
  CSS: "skills/css.png",
  "Node.js": "skills/node.png",
  Node: "skills/node.png",
  Python: "skills/Python.png",
  "C++": "skills/C++.png",
  MongoDB: "skills/mongodb.png",
  PostgreSQL: "skills/mongodb.png",
  GraphQL: "skills/graphql.png",
  Figma: "skills/figma.png",
  Flask: "skills/Python.png",
  Docker: "skills/node.png",
  AWS: "skills/node.png",
  Git: "skills/html.png",
  PyTorch: "skills/Python.png",
  "OpenAI API": "skills/Python.png",
  Pandas: "skills/Python.png",
  "Vector DBs": "skills/mongodb.png",
  "REST APIs": "skills/graphql.png",
  "Framer Motion": "skills/react.png",
  FastAPI: "skills/Python.png",
  Vercel: "skills/react.png",
};

export function getSkillIconPath(name) {
  if (!name) return null;
  return SKILL_ICON_MAP[name] ?? null;
}

export function normalizeSkillItem(item) {
  if (typeof item === "string") {
    return { name: item, icon: getSkillIconPath(item) };
  }
  return {
    name: item.name,
    icon: item.icon ?? getSkillIconPath(item.name),
  };
}
