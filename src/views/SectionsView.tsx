import { ReportSection, ReportImage } from '../types';
import { ImageCard } from '../components/ImageCard';

interface SectionsViewProps {
  sections: ReportSection[];
  onImageClick: (img: ReportImage, imagesContext?: ReportImage[]) => void;
}

export function SectionsView({ sections, onImageClick }: SectionsViewProps) {
  return (
    <div className="space-y-24 pb-20">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          {/* Section Header */}
          <div className="flex items-center mb-8 px-6 md:px-12">
            <div className="h-px flex-1 bg-blue-900/30"></div>
            <h2 className="px-6 text-3xl font-black text-white uppercase italic tracking-tighter">
              {section.title}
            </h2>
            <div className="h-px flex-1 bg-blue-900/30"></div>
          </div>

          {/* Images Grid */}
          <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.images.map((img) => (
              <ImageCard
                key={img.id}
                img={img}
                onClick={(clickedImg) => onImageClick(clickedImg, section.images)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
