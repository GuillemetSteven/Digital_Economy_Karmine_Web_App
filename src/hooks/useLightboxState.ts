import { useState, useEffect, useCallback, MouseEvent as ReactMouseEvent } from 'react';
import { ReportImage } from '../types';
import { detectImageBrightness } from '../utils/imageBrightness';
import { ZOOM } from '../constants/ui';

interface UseLightboxStateProps {
  isOpen: boolean;
  content: ReportImage | null;
}

export function useLightboxState({ isOpen, content }: UseLightboxStateProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(ZOOM.DEFAULT);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isLightImage, setIsLightImage] = useState<boolean>(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen && content) {
      setZoomLevel(ZOOM.DEFAULT);
      setPanPosition({ x: 0, y: 0 });
      setIsDragging(false);
      setIsVideo(content.mediaType === 'video');
    }
  }, [isOpen, content?.id]);

  // Brightness detection for adaptive UI
  useEffect(() => {
    if (isOpen && content?.src && content.mediaType !== 'video') {
      detectImageBrightness(content.src).then(setIsLightImage);
    } else {
      setIsLightImage(false);
    }
  }, [isOpen, content]);

  // Disable body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Zoom functions
  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + ZOOM.STEP, ZOOM.MAX));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - ZOOM.STEP, ZOOM.MIN);
      if (newZoom === ZOOM.MIN) {
        setPanPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(ZOOM.DEFAULT);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      if (prev) {
        setZoomLevel(ZOOM.DEFAULT);
        setPanPosition({ x: 0, y: 0 });
      }
      return !prev;
    });
  }, []);

  // Pan/Drag functions
  const handleMouseDown = useCallback((e: ReactMouseEvent) => {
    if (zoomLevel > ZOOM.DEFAULT) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  }, [zoomLevel, panPosition]);

  const handleMouseMove = useCallback((e: ReactMouseEvent) => {
    if (isDragging && zoomLevel > ZOOM.DEFAULT) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, zoomLevel, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Download function
  const handleDownload = useCallback(() => {
    if (!content?.src) return;

    const link = document.createElement('a');
    link.href = content.src;

    const extension = content.mediaType === 'video' ? 'mp4' : 'png';
    link.download = `${content.title.replace(/\s+/g, '_')}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [content]);

  return {
    // State
    zoomLevel,
    isFullscreen,
    panPosition,
    isDragging,
    isVideo,
    isLightImage,
    // Zoom functions
    zoomIn,
    zoomOut,
    resetZoom,
    // Fullscreen
    toggleFullscreen,
    setIsFullscreen,
    // Pan/Drag
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    // Download
    handleDownload,
  };
}
