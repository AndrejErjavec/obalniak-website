import NewsCard from "./NewsCard";

export default async function NewsGrid({ news }) {
  // const pathName = usePathname();
  // const searchParams = useSearchParams();
  // const currentPage = Number(searchParams.get("page") || 1);

  // const createPageURL = (pageNumber: number | string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("page", pageNumber.toString());
  //   return `${pathName}?${params.toString()}`;
  // };

  return (
    <>
      {news && news.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((obj, idx: number) => (
            <NewsCard event={obj} key={idx} />
          ))}
        </div>
      ) : (
        <p>Ni dogodkov</p>
      )}
    </>
  );
}
