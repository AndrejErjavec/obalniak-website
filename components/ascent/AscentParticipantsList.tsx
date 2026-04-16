function AscentParticipantsList({ names, limit }: { names: string[]; limit: number }) {
  const others = names.length >= limit ? names.length - limit : 0;
  return (
    <div className="flex flex-row items-center divide-x divide-gray-300 min-w-0 overflow-hidden">
      {names.slice(0, limit).map((name, idx) => (
        <span key={idx} className="text-sm text-gray-700 not-first:px-1.5 first:pr-1.5">
          {name}
        </span>
      ))}
      {others > 0 && (
        <div className="flex items-center justify-center bg-gray-100/30 border border-gray-200 text-xs rounded-md px-1.5 py-0.5 ml-1.5 shrink-0">
          <span>+{others}</span>
        </div>
      )}
    </div>
  );
}

export default AscentParticipantsList;
