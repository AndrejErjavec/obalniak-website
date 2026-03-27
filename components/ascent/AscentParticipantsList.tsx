function AscentParticipantsList({ names, limit }: { names: string[]; limit: number }) {
  const others = names.length >= limit ? names.length - limit : 0;
  return (
    <div className="flex flex-row items-center divide-x divide-gray-300">
      {names.slice(0, limit).map((name, idx) => (
        <span key={idx} className="text-sm text-gray-700 px-1.5">
          {name}
        </span>
      ))}
      {others > 0 && (
        <div className="flex items-center justify-center bg-gray-100/30 border border-gray-200 text-xs font-semibold rounded-md px-1.5 py-0.5 ml-1.5">
          <span>+{others}</span>
        </div>
      )}
    </div>
  );
}

export default AscentParticipantsList;
