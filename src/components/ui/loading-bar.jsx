export default function LoadingBar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="relative w-full h-1 bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-brand-500 animate-loading-bar" />
      </div>
    </div>
  );
};
