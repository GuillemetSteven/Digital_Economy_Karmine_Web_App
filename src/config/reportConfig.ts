import { ReportConfig } from '../types';

// Configuration du rapport - À modifier selon ton projet
export const reportConfig: ReportConfig = {
  title: "Karmine Corp",
  subtitle: "Digital Company Economy",
  student: "Steven Guillemet",
  year: "2025-2026",
  lastUpdate: "2024-12-24",
  sections: [
    {
      id: 'intro',
      title: "1. Introduction & Présentation",
      images: [
        {
          id: 102,
          title: "Présentation Kamel",
          source: "Vidéo interne",
          src: `${import.meta.env.BASE_URL}imgs/poesie_video_kamel.mp4`,
          mediaType: 'video' as const,
          videoThumbnail: `${import.meta.env.BASE_URL}imgs/kameto.jpg`,
        },
      ]
    },
    {
      id: 'macro',
      title: "2. Macro-Environnement",
      images: [
        {
          id: 201,
          title: "Matrice PESTEL",
          source: "Analyse personnelle",
          src: `${import.meta.env.BASE_URL}imgs/PESTEL_kc.JPG`,
          pageNumber: 14,
        },
        {
          id: 203,
          title: "5 Forces de Porter",
          source: "Cours Stratégie",
          src: `${import.meta.env.BASE_URL}imgs/5_PORTER.JPG`,
          pageNumber: 15,
        },
      ]
    },
    {
      id: 'micro',
      title: "3. Micro-Environnement",
      images: [
        {
          id: 301,
          title: "Matrice SWOT",
          source: "Interne",
          src: `${import.meta.env.BASE_URL}imgs/swot_kc.JPG`,
          pageNumber: 16,
        },
        {
          id: 302,
          title: "SWOT Consolidé",
          source: "Interne",
          src: `${import.meta.env.BASE_URL}imgs/swot_consolide_kc.JPG`,
          pageNumber: 17,
        },
        {
          id: 303,
          title: "Analyse VRIO",
          source: "Interne",
          src: `${import.meta.env.BASE_URL}imgs/VRIO_kc.JPG`,
          pageNumber: 18,
        },
      ]
    },
    {
      id: 'strat',
      title: "4. Stratégie & Benchmark",
      images: [
        {
          id: 401,
          title: "Benchmark Concurrents",
          source: "Sites officiels G2/Vitality",
          src: `${import.meta.env.BASE_URL}imgs/benchmark_kc.JPG`,
          pageNumber: 19,
        },
        {
          id: 402,
          title: "Strategic Canvas",
          source: "Blue Ocean Strategy",
          src: `${import.meta.env.BASE_URL}imgs/STRATEGIC_CANVAS_kc.png`,
          pageNumber: 21,
        },
        {
          id: 403,
          title: "Value Proposition",
          source: "Etude qualitative",
          src: `${import.meta.env.BASE_URL}imgs/Value_Proposition_Canvas_kc.png`,
          pageNumber: 23,
        },
      ]
    },
    {
      id: 'business',
      title: "5. Business Model",
      images: [
        {
          id: 501,
          title: "Business Model Canvas",
          source: "Strategyzer",
          src: `${import.meta.env.BASE_URL}imgs/business_model_canvas_kc.JPG`,
          pageNumber: 26,
        },
        {
          id: 502,
          title: "Matrice TOWS",
          source: "Interne",
          src: `${import.meta.env.BASE_URL}imgs/tows.png`,
          pageNumber: 29,
        },
      ]
    }
  ]
};
