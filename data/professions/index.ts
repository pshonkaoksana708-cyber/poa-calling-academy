import { aiProfession } from "@/data/professions/ai";
import { hrProfession } from "@/data/professions/hr";
import { logisticsProfession } from "@/data/professions/logistics";
import { supplyProfession } from "@/data/professions/supply";
import { tourismProfession } from "@/data/professions/tourism";

export const professions = [
  supplyProfession,
  logisticsProfession,
  hrProfession,
  tourismProfession,
  aiProfession,
];

export function getProfession(slug: string) {
  return professions.find((profession) => profession.slug === slug);
}

export function getProfessionLevel(professionSlug: string, levelSlug: string) {
  const profession = getProfession(professionSlug);
  const level = profession?.levels.find((item) => item.slug === levelSlug);

  if (!profession || !level) {
    return null;
  }

  return { profession, level };
}

export function getProgramAccessKey(professionSlug: string, levelSlug: string) {
  return `${professionSlug}/${levelSlug}`;
}

export function getPackageAccessKey(professionSlug: string, packageSlug: string) {
  return `${professionSlug}/package/${packageSlug}`;
}

export function getAllowedAccessKeysForLevel(
  professionSlug: string,
  levelSlug: string,
) {
  const profession = getProfession(professionSlug);

  if (!profession) {
    return [];
  }

  const directLevelAccess = getProgramAccessKey(professionSlug, levelSlug);
  const packageAccess = profession.packages
    .filter((item) => item.includedLevelSlugs.includes(levelSlug))
    .map((item) => getPackageAccessKey(professionSlug, item.slug));

  return [directLevelAccess, ...packageAccess];
}
