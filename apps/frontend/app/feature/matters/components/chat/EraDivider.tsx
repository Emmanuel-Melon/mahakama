export function EraDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
        {date}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
