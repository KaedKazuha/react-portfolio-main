import { useEffect, useState } from "react";

const QUERIES = {
  coarse: "(pointer: coarse)",
  hoverNone: "(hover: none)",
  narrow: "(max-width: 768px)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
};

export function getMobileProfile() {
  if (typeof window === "undefined") {
    return {
      mobile: false,
      liteMode: false,
      coarse: false,
      hoverNone: false,
      narrow: false,
      reduceMotion: false,
    };
  }

  const coarse = window.matchMedia(QUERIES.coarse).matches;
  const hoverNone = window.matchMedia(QUERIES.hoverNone).matches;
  const narrow = window.matchMedia(QUERIES.narrow).matches;
  const reduceMotion = window.matchMedia(QUERIES.reduceMotion).matches;
  const mobile = coarse || (hoverNone && narrow);

  return {
    mobile,
    coarse,
    hoverNone,
    narrow,
    reduceMotion,
    liteMode: mobile || reduceMotion,
  };
}

export function isLiteMode() {
  return getMobileProfile().liteMode;
}

export function useMobileProfile() {
  const [profile, setProfile] = useState(getMobileProfile);

  useEffect(() => {
    const media = Object.values(QUERIES).map((query) => window.matchMedia(query));
    const update = () => setProfile(getMobileProfile());

    media.forEach((mq) => mq.addEventListener("change", update));
    return () => media.forEach((mq) => mq.removeEventListener("change", update));
  }, []);

  return profile;
}
