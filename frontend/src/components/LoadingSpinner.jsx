const LoadingSpinner = ({ fullScreen = false, message = "Processing..." }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-2 border-slate-800 border-t-cyan-400 border-r-blue-500 animate-spin shadow-lg shadow-cyan-500/20"></div>
        <div className="absolute h-8 w-8 rounded-full border-2 border-slate-800 border-b-indigo-400 border-l-cyan-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
        <div className="absolute h-3 w-3 bg-cyan-400 rounded-full animate-ping"></div>
      </div>
      {message && <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase animate-pulse">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-16">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
