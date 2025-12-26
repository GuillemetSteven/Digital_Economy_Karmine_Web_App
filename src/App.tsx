import { useState, useCallback, lazy, Suspense } from 'react';
import { ViewType, ReportImage } from './types';
import { reportConfig } from './config/reportConfig';
import { Loader } from './components/Loader';
import { Lightbox } from './components/Lightbox';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';
import { TopBar } from './components/layout/TopBar';
import { SectionsView } from './views/SectionsView';  // Keep eager (initial view)

// Lazy load other views for code splitting and better TTI
const GalleryView = lazy(() => import('./views/GalleryView'));
const BibliographyView = lazy(() => import('./views/BibliographyView'));
const LexiqueView = lazy(() => import('./views/LexiqueView'));

// Loading fallback for lazy-loaded views
function ViewLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-blue-400 font-mono animate-pulse">
        LOADING VIEW...
      </div>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('sections');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReportImage | null>(null);
  const [modalImages, setModalImages] = useState<ReportImage[]>([]);
  const [modalIndex, setModalIndex] = useState<number>(0);

  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageClick = useCallback((img: ReportImage, imagesContext: ReportImage[] = []) => {
    setModalContent(img);
    setModalImages(imagesContext);

    // Find index of clicked image in context
    const index = imagesContext.findIndex(i => i.id === img.id);
    setModalIndex(index >= 0 ? index : 0);
  }, []);

  const handleLightboxNavigate = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < modalImages.length) {
      setModalIndex(newIndex);
      setModalContent(modalImages[newIndex]);
    }
  }, [modalImages]);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Render the appropriate view with lazy loading support
  const renderView = () => {
    switch (currentView) {
      case 'gallery':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <GalleryView sections={reportConfig.sections} onImageClick={handleImageClick} />
          </Suspense>
        );
      case 'biblio':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <BibliographyView />
          </Suspense>
        );
      case 'lexique':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <LexiqueView />
          </Suspense>
        );
      default:
        return <SectionsView sections={reportConfig.sections} onImageClick={handleImageClick} />;
    }
  };

  return (
    <>
      {/* Loader */}
      {isLoading && <Loader onComplete={handleLoaderComplete} />}

      {/* Main App */}
      <div
        className={`min-h-screen bg-karmine-bg text-gray-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col md:flex-row transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Mobile Header */}
        <MobileHeader isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          sections={reportConfig.sections}
          student={reportConfig.student}
          year={reportConfig.year}
          lastUpdate={reportConfig.lastUpdate}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-20 md:pt-0 min-h-screen relative overflow-x-hidden">
          <TopBar currentView={currentView} />
          <div className="md:pt-24">{renderView()}</div>
        </main>

        {/* Lightbox */}
        <Lightbox
          isOpen={!!modalContent}
          onClose={() => {
            setModalContent(null);
            setModalImages([]);
            setModalIndex(0);
          }}
          content={modalContent}
          images={modalImages}
          currentIndex={modalIndex}
          onNavigate={handleLightboxNavigate}
        />
      </div>
    </>
  );
}
