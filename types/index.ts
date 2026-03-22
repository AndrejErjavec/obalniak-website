export type NewsType = "Običajna novica" | "Alpinistična šola";

export type SuccessResult<D> = {
  success: true;
  data?: D;
};

export type ErrorResult = {
  success: false;
  error: string;
  fields?: Record<string, string[]>;
};

export type ActionResult<T> = SuccessResult<T> | ErrorResult;

export type PaginatedData<D> = {
  data: D;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
  };
};
