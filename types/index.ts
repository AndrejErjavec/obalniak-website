export type NewsType = "Običajna novica" | "Alpinistična šola";

export type ErrorResult<E> = {
  error: E;
  // data?: never;
};

export type SuccessResult<D> = {
  // error?: never;
  data: D;
};

export type Result<E, D> = NonNullable<ErrorResult<E> | SuccessResult<D>>;
