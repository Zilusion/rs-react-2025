'use client';

import { revalidateAndRetry } from "@/app/actions";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

interface DetailsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DetailsError({ error }: DetailsErrorProps) {
  const pathname = usePathname();

 const [isPending, startTransition] = useTransition();

 const handleRetry = () => {
   startTransition(() => {
     revalidateAndRetry(pathname);
   });
 };

  return (
    <div className="bg-red-100 p-4 text-red-700">
      <h2 className="font-bold">Could not fetch artwork details!</h2>
      <p className="text-sm">{error.message}</p>
      <button
        onClick={handleRetry}
        disabled={isPending}
        className="mt-2 rounded bg-red-600 px-4 py-2 text-white"
      >
        {isPending ? 'Retrying...' : 'Try Again'}
      </button>
    </div>
  );
}
