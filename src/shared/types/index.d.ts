type ReactTagProps<T> = import("react").ComponentPropsWithRef<T>;

interface ApiSuccessResponse<T> {
  status: "success";
  message: string;
  data: T;
}

interface ApiErrorResponse<T = unknown> {
  error: string;
  message: string;
  request?: T;
}

interface SEO {
  browser_title: string;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
