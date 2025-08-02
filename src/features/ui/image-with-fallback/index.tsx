import { useEffect, useState } from 'react';

interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const handleImageError = () => {
    setError(true);
  };

  const shouldShowPlaceholder = !src || error;

  if (shouldShowPlaceholder) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-sm text-gray-400 dark:bg-gray-800 dark:text-gray-500 ${className}`}
      >
        No Image Available
      </div>
    );
  }

  return (
    <img src={src} alt={alt} className={className} onError={handleImageError} />
  );
}
