const mediaImage = (imagePath: `/images/${string}`) => `/media${imagePath}`;

export const siteImages = {
  hero: mediaImage("/images/author/author-01.webp"),
  founderAbout: mediaImage("/images/author/author-02.webp"),
  founderPortrait: mediaImage("/images/author/author-03.webp"),
  founderDetail: mediaImage("/images/author/author-06.webp"),
  supplyProfession: mediaImage("/images/supply/supply-06.jpg"),
  supplyBasicLevel: mediaImage("/images/supply/supply-basic.jpg"),
  supplyPracticeLevel: mediaImage("/images/supply/supply-practice.jpg"),
  supplyProLevel: mediaImage("/images/supply/supply-pro.jpg"),
  logisticsProfession: mediaImage("/images/logistics/logistics-hero.jpg"),
  logisticsBasicLevel: mediaImage("/images/logistics/logistics-basic.jpg"),
  logisticsPracticeLevel: mediaImage("/images/logistics/logistics-practice.jpg"),
  logisticsProLevel: mediaImage("/images/logistics/logistics-pro.jpg"),
  hrProfession: mediaImage("/images/hr/hr-hero.png"),
  hrBasicLevel: mediaImage("/images/hr/hr-basic.jpg"),
  hrPracticeLevel: mediaImage("/images/hr/hr-practice.jpg"),
  hrProLevel: mediaImage("/images/hr/hr-pro.png"),
  tourismProfession: mediaImage("/images/supply/supply-05.jpg"),
  tourismBasicLevel: mediaImage("/images/levels/tourism-level-01.jpg"),
  tourismPracticeLevel: mediaImage("/images/levels/tourism-level-02.jpg"),
  tourismProLevel: mediaImage("/images/levels/tourism-level-03.jpg"),
  aiProfession: mediaImage("/images/professions/professions-02.jpg"),
  aiBasicLevel: mediaImage("/images/levels/ai-level-basic.webp.jpg"),
  aiPracticeLevel: mediaImage("/images/levels/ai-level-practical.webp.jpg"),
  aiProLevel: mediaImage("/images/professions/professions-04.jpg"),
  learning: mediaImage("/images/education/education-01.jpg"),
  approach: mediaImage("/images/education/education-02.jpg"),
  access: mediaImage("/images/education/education-03.jpg"),
  officePrimary: mediaImage("/images/office/office-04.jpg"),
  officeSecondary: mediaImage("/images/office/office-03.jpg"),
  teamPrimary: mediaImage("/images/team/team-02.jpg"),
};

export const fallbackImages = {
  profession: mediaImage("/images/education/education-01.jpg"),
  level: mediaImage("/images/education/education-02.jpg"),
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
