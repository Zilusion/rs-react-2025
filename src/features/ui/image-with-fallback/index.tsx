import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  width = 400,
  height = 400,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const shouldShowPlaceholder = !src || error;

  const t = useTranslations('Image');

  if (shouldShowPlaceholder) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-sm text-gray-400 dark:bg-gray-800 dark:text-gray-500 ${className}`}
      >
        {t('noImage')}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setError(true)}
    />
  );
}
