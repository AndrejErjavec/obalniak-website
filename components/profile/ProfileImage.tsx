export default function ProfileImage({ firstName, lastName, size = 32 }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 font-medium text-white rounded-full bg-blue-500"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {firstName.slice(0, 1)}{lastName.slice(0, 1)}
    </div>
  );
}
