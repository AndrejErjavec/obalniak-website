export default function AscentSkeleton() {
  return (
    <div className="flex flex-row border rounded h-32 animate-pulse cursor-pointer">
      {/* Skeleton for Image */}
      <div className="flex justify-center items-center bg-gray-200 rounded-l w-32 md:w-44"></div>

      <div className="flex flex-row flex-1 justify-between items-center px-5">
        <div className="flex flex-col gap-3 md:gap-5 w-full">
          {/* Skeleton for Title */}
          <div className="w-full h-6 bg-gray-200 rounded-md"></div>

          {/* Skeleton for Profile */}
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

          {/* Skeleton for Details */}
          <div className="flex flex-col md:flex-row md:gap-5 mt-3">
            <div className="flex gap-2 items-center">
              <div className="w-16 h-4 bg-gray-200 rounded-md"></div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-24 h-4 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}