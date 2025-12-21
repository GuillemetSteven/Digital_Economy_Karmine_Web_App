// Type pour le média
export type MediaType = 'image' | 'video';

// Type pour une image
export interface ReportImage {
  id: number;
  title: string;
  source: string;
  src: string | null;
  mediaType?: MediaType;
  videoThumbnail?: string;
  pageNumber?: number;
}

// Type pour une section
export interface ReportSection {
  id: string;
  title: string;
  images: ReportImage[];
}

// Configuration complète du rapport
export interface ReportConfig {
  title: string;
  subtitle: string;
  student: string;
  year: string;
  sections: ReportSection[];
}

// Type pour les vues
export type ViewType = 'sections' | 'gallery' | 'biblio' | 'lexique';
