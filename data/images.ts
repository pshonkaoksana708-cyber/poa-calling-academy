export const siteImages = {
  hero: "/images/author/author-01.webp",
  founderAbout: "/images/author/author-07.webp",
  founderPortrait: "/images/author/author-08.webp",
  founderDetail: "/images/author/author-13.webp",
  supplyProfession: "/images/supply/supply-06.jpg",
  supplyBasicLevel: "/images/supply/supply-basic.jpg",
  supplyPracticeLevel: "/images/supply/supply-practice.jpg",
  supplyProLevel: "/images/supply/supply-pro.jpg",
  logisticsProfession: "/images/logistics/logistics-hero.jpg",
  logisticsBasicLevel: "/images/logistics/logistics-basic.jpg",
  logisticsPracticeLevel: "/images/logistics/logistics-practice.jpg",
  logisticsProLevel: "/images/logistics/logistics-pro.jpg",
  hrProfession: "/images/hr/hr-hero.png",
  hrBasicLevel: "/images/hr/hr-basic.jpg",
  hrPracticeLevel: "/images/hr/hr-practice.jpg",
  hrProLevel: "/images/hr/hr-pro.png",
  tourismProfession: "/images/supply/supply-05.jpg",
  tourismBasicLevel: "/images/levels/tourism-level-01.jpg",
  tourismPracticeLevel: "/images/levels/tourism-level-02.jpg",
  tourismProLevel: "/images/levels/tourism-level-03.jpg",
  aiProfession: "/images/professions/professions-02.jpg",
  aiBasicLevel: "/images/levels/ai-level-basic.webp.jpg",
  aiPracticeLevel: "/images/levels/ai-level-practical.webp.jpg",
  aiProLevel: "/images/professions/professions-04.jpg",
  learning: "/images/education/education-01.jpg",
  approach: "/images/education/education-02.jpg",
  access: "/images/education/education-03.jpg",
  officePrimary: "/images/office/office-04.jpg",
  officeSecondary: "/images/office/office-03.jpg",
  teamPrimary: "/images/team/team-02.jpg",
};

export const fallbackImages = {
  profession: "/images/education/education-01.jpg",
  level: "/images/education/education-02.jpg",
};

export function getProfessionImage(slug: string) {
  if (slug === "supply") {
    return siteImages.supplyProfession;
  }

  if (slug === "logistics") {
    return siteImages.logisticsProfession;
  }

  if (slug === "hr") {
    return siteImages.hrProfession;
  }

  if (slug === "tourism") {
    return siteImages.tourismProfession;
  }

  if (slug === "ai") {
    return siteImages.aiProfession;
  }

  return fallbackImages.profession;
}

export function getSupplyLevelImage(_levelSlug: string) {
  if (_levelSlug === "basic") {
    return siteImages.supplyBasicLevel;
  }

  if (_levelSlug === "practice") {
    return siteImages.supplyPracticeLevel;
  }

  if (_levelSlug === "pro") {
    return siteImages.supplyProLevel;
  }

  return fallbackImages.level;
}

export function getProfessionLevelImage(professionSlug: string, levelSlug: string) {
  if (professionSlug === "supply") {
    return getSupplyLevelImage(levelSlug);
  }

  if (professionSlug === "hr") {
    if (levelSlug === "basic") {
      return siteImages.hrBasicLevel;
    }

    if (levelSlug === "practice") {
      return siteImages.hrPracticeLevel;
    }

    if (levelSlug === "pro") {
      return siteImages.hrProLevel;
    }
  }

  if (professionSlug === "logistics") {
    if (levelSlug === "basic") {
      return siteImages.logisticsBasicLevel;
    }

    if (levelSlug === "practice") {
      return siteImages.logisticsPracticeLevel;
    }

    if (levelSlug === "pro") {
      return siteImages.logisticsProLevel;
    }
  }

  if (professionSlug === "tourism") {
    if (levelSlug === "basic") {
      return siteImages.tourismBasicLevel;
    }

    if (levelSlug === "practice") {
      return siteImages.tourismPracticeLevel;
    }

    if (levelSlug === "pro") {
      return siteImages.tourismProLevel;
    }
  }

  if (professionSlug === "ai") {
    if (levelSlug === "basic") {
      return siteImages.aiBasicLevel;
    }

    if (levelSlug === "practice") {
      return siteImages.aiPracticeLevel;
    }

    if (levelSlug === "pro") {
      return siteImages.aiProLevel;
    }
  }

  return getProfessionImage(professionSlug);
}
