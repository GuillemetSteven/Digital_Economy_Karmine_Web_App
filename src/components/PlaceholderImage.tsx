import { Image as ImageIcon } from 'lucide-react';

interface PlaceholderImageProps {
  title: string;
  className?: string;
}

export function PlaceholderImage({ title, className = '' }: PlaceholderImageProps) {
  return (
    <div className={`w-full h-full bg-karmine-darker flex flex-col items-center justify-center p-6 text-center border border-dashed border-blue-900/30 rounded-lg group-hover:border-blue-500/50 transition-colors ${className}`}>
      <ImageIcon className="w-12 h-12 text-blue-900 mb-3 group-hover:text-blue-500 transition-colors" />
      <span className="text-gray-500 font-medium text-sm group-hover:text-gray-300">{title}</span>
      <span className="text-xs text-blue-900 mt-2 px-2 py-1 bg-blue-900/10 rounded">Emplacement Image</span>
    </div>
  );
}
