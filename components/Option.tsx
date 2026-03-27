export default function Option<D>({
  title,
  value,
  selectedType,
  setSelectedType,
}: {
  title: string;
  value: D;
  selectedType: D;
  setSelectedType: (value: D) => void;
}) {
  const isActive = value === selectedType;

  return (
    <div
      className={`flex px-3 py-3 text-sm font-semibold transition cursor-pointer ${
        isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={() => setSelectedType(value)}
    >
      {title}
    </div>
  );
}
