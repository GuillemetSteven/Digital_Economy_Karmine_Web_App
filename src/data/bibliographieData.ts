export interface BibliographySource {
  id: number;
  author: string;
  year: string;
  title: string;
  url: string;
  section: string;
  subsection?: string;
}

export const bibliographieData: BibliographySource[] = [
  // I. INTRODUCTION
  // A. Présentation de l'entreprise - 1. Sources officielles Karmine Corp
  {
    id: 1,
    author: "Karmine Corp",
    year: "2025",
    title: "Site officiel",
    url: "https://karminecorp.fr",
    section: "Introduction",
    subsection: "Karmine Corp"
  },
  {
    id: 2,
    author: "Liquipedia",
    year: "2025",
    title: "Karmine Corp - League of Legends Esports Wiki",
    url: "https://liquipedia.net/leagueoflegends/Karmine_Corp",
    section: "Introduction",
    subsection: "Karmine Corp"
  },
  {
    id: 3,
    author: "Wikipedia",
    year: "2025",
    title: "Karmine Corp",
    url: "https://en.wikipedia.org/wiki/Karmine_Corp",
    section: "Introduction",
    subsection: "Karmine Corp"
  },

  // A. Présentation de l'entreprise - 2. Articles de presse et analyses
  {
    id: 4,
    author: "Sheep Esports",
    year: "2024",
    title: "Karmine Corp: A Look Back at the Club's First 3 Financial Years",
    url: "https://www.sheepesports.com/articles/karmine-corp-a-look-back-at-the-club-s-first-3-financial-years/en",
    section: "Introduction",
    subsection: "Karmine Corp"
  },
  {
    id: 5,
    author: "Esports Insider",
    year: "2025",
    title: "Karmine Corp Achieves Second Year of Profitability",
    url: "https://esportsinsider.com/2025/01/karmine-corp-second-year-profitability",
    section: "Introduction",
    subsection: "Karmine Corp"
  },
  {
    id: 6,
    author: "Esports Insider",
    year: "2023",
    title: "Karmine Corp Opens First Dedicated Esports Stadium for LEC",
    url: "https://esportsinsider.com/2023/09/karmine-corp-esports-stadium-lec",
    section: "Introduction",
    subsection: "Karmine Corp"
  },
  {
    id: 7,
    author: "PixCapital",
    year: "2024",
    title: "PixCapital Levels Up with Karmine Corp Investment",
    url: "https://pixcapital.vc/news/pixcapital-levels-up-with-karmine-corp-investment/",
    section: "Introduction",
    subsection: "Karmine Corp"
  },

  // A. Présentation de l'entreprise - 3. Données de performance
  {
    id: 8,
    author: "Lolesports",
    year: "2025",
    title: "Karmine Corp - Team Profile & Statistics",
    url: "https://lolesports.com/teams/karmine-corp",
    section: "Introduction",
    subsection: "Karmine Corp"
  },
  {
    id: 9,
    author: "Esports Charts",
    year: "2025",
    title: "KCX4 Viewership Statistics",
    url: "https://escharts.com/organizations/karmine-corp",
    section: "Introduction",
    subsection: "Karmine Corp"
  },
  {
    id: 10,
    author: "Esports Earnings",
    year: "2025",
    title: "Karmine Corp - Prize Money Rankings",
    url: "https://www.esportsearnings.com/teams/25126-karmine-corp",
    section: "Introduction",
    subsection: "Karmine Corp"
  },

  // B. Kamel "Kameto" Kebir - 1. Biographies officielles
  {
    id: 11,
    author: "Wikipedia",
    year: "2025",
    title: "Kameto (Kamel Kebir)",
    url: "https://fr.wikipedia.org/wiki/Kameto",
    section: "Introduction",
    subsection: "Kameto"
  },
  {
    id: 12,
    author: "Actustream",
    year: "2024",
    title: "Kameto - Profil du Streamer",
    url: "https://actustream.fr/streamers/kameto",
    section: "Introduction",
    subsection: "Kameto"
  },
  {
    id: 13,
    author: "Red Bull",
    year: "2023",
    title: "Kameto : Portrait du Co-Fondateur de la Karmine Corp",
    url: "https://www.redbull.com/fr-fr/kameto-karmine-corp-portrait",
    section: "Introduction",
    subsection: "Kameto"
  },
  {
    id: 14,
    author: "Gamesider",
    year: "2024",
    title: "Kameto - Biographie Complète",
    url: "https://www.gamesider.com/jeux-video/je-vais-tout-arreter-kameto-reagit-a-la-crise-qui-secoue-la-karmine-corp-apres-la-suspension-dapples_art43792.html",
    section: "Introduction",
    subsection: "Kameto"
  },

  // B. Kamel "Kameto" Kebir - 2. Radio Sexe et contenus innovants
  {
    id: 15,
    author: "Wikipedia",
    year: "2024",
    title: "Radio Sexe",
    url: "https://fr.wikipedia.org/wiki/Radio_Sexe",
    section: "Introduction",
    subsection: "Kameto"
  },
  {
    id: 16,
    author: "Gamesider",
    year: "2019",
    title: "Radio Sexe : Après un Carton sur Twitch, la Fin de l'Émission",
    url: "https://www.gamesider.com/streaming/twitch/radio-sexe-apres-un-carton-sur-twitch-la-fin-de-l-emission-annoncee-par-kameto-et-kotei-sur-twitter_art29515.html#:~:text=Voici%20la%20principale%20raison%20de,%C3%A9mission%20n'aurait%20pas%20exist%C3%A9.",
    section: "Introduction",
    subsection: "Kameto"
  },

  // B. Kamel "Kameto" Kebir - 3. Statistiques Twitch
  {
    id: 17,
    author: "TwitchTracker",
    year: "2025",
    title: "Kamet0 - Statistics & Analytics",
    url: "https://twitchtracker.com/kamet0",
    section: "Introduction",
    subsection: "Kameto"
  },

  // C. Marché Esportif Européen - 1. Études de marché et croissance
  {
    id: 18,
    author: "IMARC Group",
    year: "2024",
    title: "European Esports Market Report 2024-2033",
    url: "https://www.imarcgroup.com/europe-esports-market#:~:text=The%20Europe%20esports%20market%20size,11.04%25%20from%202025%2D2033.",
    section: "Introduction",
    subsection: "Marché Esportif"
  },
  {
    id: 19,
    author: "Grand View Research",
    year: "2024",
    title: "Europe Esports Market Size, Share & Trends Analysis Report 2024-2033",
    url: "https://www.imarcgroup.com/europe-esports-market#:~:text=The%20Europe%20esports%20market%20size,11.04%25%20from%202025%2D2033.",
    section: "Introduction",
    subsection: "Marché Esportif"
  },

  // C. Marché Esportif Européen - 2. Marché français
  {
    id: 20,
    author: "SELL",
    year: "2024",
    title: "L'Essentiel du Jeu Vidéo en France",
    url: "https://www.sell.fr/sites/default/files/essentiel-jeu-video/ejv_octobre_2024.pdf",
    section: "Introduction",
    subsection: "Marché Esportif"
  },

  // C. Marché Esportif Européen - 3. Institutionnalisation
  {
    id: 21,
    author: "UFCEP",
    year: "2025",
    title: "Union Française des Clubs Esportifs Professionnels - Création et Objectifs",
    url: "https://ufcep.org/",
    section: "Introduction",
    subsection: "Marché Esportif"
  },

  // D. Paysage Concurrentiel - 1. G2 Esports
  {
    id: 22,
    author: "Sheep Esports",
    year: "2024",
    title: "G2 Esports: Sporting and Financial Champion",
    url: "https://www.sheepesports.com/articles/g2-esports-sporting-and-financial-champion/en",
    section: "Introduction",
    subsection: "Concurrence"
  },

  // D. Paysage Concurrentiel - 2. Team Vitality
  {
    id: 23,
    author: "Canvas Business Model",
    year: "2024",
    title: "Team Vitality: How It Works",
    url: "https://canvasbusinessmodel.com/blogs/how-it-works/team-vitality-how-it-works",
    section: "Introduction",
    subsection: "Concurrence"
  },

  // D. Paysage Concurrentiel - 3. MAD Lions KOI
  {
    id: 24,
    author: "Wikipedia",
    year: "2024",
    title: "Movistar KOI",
    url: "https://en.wikipedia.org/wiki/Movistar_KOI",
    section: "Introduction",
    subsection: "Concurrence"
  },

  // II. MACRO-ENVIRONNEMENT
  // A. Analyse PESTEL
  {
    id: 25,
    author: "UFCEP",
    year: "2025",
    title: "Création de l'Union Française des Clubs Esportifs Professionnels",
    url: "https://ufcep.org/",
    section: "Macro-environnement",
    subsection: "PESTEL"
  },
  {
    id: 26,
    author: "IMARC Group",
    year: "2024",
    title: "European Esports Market Report 2024-2033 - Croissance marché 1,7B → 4,3B USD, CAGR 11-24%",
    url: "https://www.imarcgroup.com/europe-esports-market",
    section: "Macro-environnement",
    subsection: "PESTEL"
  },

  // B. Analyse des 5 Forces de Porter
  {
    id: 27,
    author: "Riot Games",
    year: "2024",
    title: "LEC Franchise Rules and Revenue Sharing Model",
    url: "https://www.riotgames.com/en/news/lol-esports-strategy-adjustments-2024",
    section: "Macro-environnement",
    subsection: "5 Forces de Porter"
  },
  {
    id: 28,
    author: "Esports Insider",
    year: "2024",
    title: "LEC Franchise Fees Analysis",
    url: "https://esportsinsider.com/2024/11/overactive-media-riot-games-lec-franchise-fees",
    section: "Macro-environnement",
    subsection: "5 Forces de Porter"
  },

  // III. MICRO-ENVIRONNEMENT
  // A. Analyse SWOT
  {
    id: 29,
    author: "Sheep Esports",
    year: "2024",
    title: "Karmine Corp: A Look Back at the Club's First 3 Financial Years",
    url: "https://www.sheepesports.com/fr/articles/karmine-corp-a-look-back-at-the-club-s-first-3-financial-years/en",
    section: "Micro-environnement",
    subsection: "SWOT"
  },

  // IV. STRATEGIC CANVAS
  {
    id: 30,
    author: "Kim, W. C., & Mauborgne, R.",
    year: "2015",
    title: "Blue Ocean Strategy, Expanded Edition: How to Create Uncontested Market Space and Make the Competition Irrelevant",
    url: "https://www.researchgate.net/publication/256807016_Blue_Ocean_Strategy_How_to_Create_Uncontested_Market_Space_and_Make_the_Competition_Irrelevant_W_Chan_Kim_Renee_Mauborgne_Harvard_Business_School_Press_2005_240_pp_2995_hardcover",
    section: "Strategic Canvas",
    subsection: "Cours Stratégie"
  },

  // V. BUSINESS MODEL CANVAS
  {
    id: 31,
    author: "Osterwalder, A., & Pigneur, Y.",
    year: "2010",
    title: "Business Model Generation: A Handbook for Visionaries, Game Changers, and Challengers",
    url: "https://mymyeo.com/wp-content/uploads/2022/12/Business-model-generation-_-a-handbook-for-visionaries-game-changers-and-challengers-PDFDrive-1.pdf",
    section: "Business Model Canvas",
    subsection: "Cours Stratégie"
  },
  {
    id: 32,
    author: "Sheep Esports",
    year: "2024",
    title: "Karmine Corp Financial Analysis - Revenus 2024 : ~€9,25M, Merchandising €3-4M (40%), EBITDA 21%",
    url: "https://www.sheepesports.com/fr/articles/karmine-corp-a-look-back-at-the-club-s-first-3-financial-years/en",
    section: "Business Model Canvas",
    subsection: "Cours Stratégie"
  },

  // VII. SOURCES COMPLÉMENTAIRES
  // A. Fan Engagement et Communautés Esport
  {
    id: 33,
    author: "Frontiers in Sports",
    year: "2024",
    title: "Esports Fan Engagement Models",
    url: "https://www.frontiersin.org/articles/10.3389/fspor.2024.1362489/full",
    section: "Sources complémentaires",
    subsection: "Fan Engagement"
  },
  {
    id: 34,
    author: "Qualifio",
    year: "2024",
    title: "Fan Engagement : Meilleures Stratégies pour les Clubs de Sport",
    url: "https://qualifio.com/fr/blog/fan-engagement-meilleures-strategies-pour-les-clubs-de-sport/",
    section: "Sources complémentaires",
    subsection: "Fan Engagement"
  },

  // B. Sponsorships et Monétisation
  {
    id: 35,
    author: "SportFive",
    year: "2024",
    title: "Esports and Sponsorship: A Rising Market",
    url: "https://sportfive.com/beyond-the-match/insights/esports-and-sponsorship-a-rising-market",
    section: "Sources complémentaires",
    subsection: "Sponsorships"
  }
];

// Helper pour obtenir les sections uniques
export const getSections = (): string[] => {
  return [...new Set(bibliographieData.map(source => source.section))];
};

// Helper pour obtenir les sources par section
export const getSourcesBySection = (section: string): BibliographySource[] => {
  return bibliographieData.filter(source => source.section === section);
};
