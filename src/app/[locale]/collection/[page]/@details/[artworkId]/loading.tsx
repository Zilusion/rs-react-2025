import { Loader } from "@/features/ui/loader";

export default function Loading() {
  return (
    <div className="sticky top-28 flex h-96 items-center justify-center rounded-lg bg-white p-4 shadow-lg ring-1 ring-gray-200 dark:bg-gray-900">
      <Loader />
    </div>
  );
}
