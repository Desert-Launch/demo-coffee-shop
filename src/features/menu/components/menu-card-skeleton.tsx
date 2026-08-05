import { Skeleton } from "@/components/ui/skeleton";

export function MenuCardSkeleton() {
  return (
    <div className="rounded-lg border border-roast-700 bg-roast-800 p-5">
      <div className="flex gap-4">
        <Skeleton className="h-24 w-16 rounded-t-[3px] rounded-b-[12px]" />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-3/4" />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}
