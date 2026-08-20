const PageHeader = ({ title, description, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800/60 pb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
