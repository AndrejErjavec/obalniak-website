import { User } from "@/app/generated/prisma";

export type NewsType = "Običajna novica" | "Alpinistična šola";

export type SuccessResult<D> = {
  success: true;
  data: D;
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

export type ExistingPhotoItem = {
  id: string;
  kind: "existing";
  url: string;
  name: string;
};

export type NewPhotoItem = {
  id: string;
  kind: "new";
  file: File;
  previewUrl: string;
  name: string;
};

export type EditablePhotoItem = ExistingPhotoItem | NewPhotoItem;

export type AscentFilterType = "route" | "climbers";

export type CoClimber = User | string;
