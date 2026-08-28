interface ResendSuccessBannerProps {
  message?: string;
}

export function ResendSuccessBanner({ message }: ResendSuccessBannerProps) {
  return (
    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-700">
      {message}
    </div>
  );
}
