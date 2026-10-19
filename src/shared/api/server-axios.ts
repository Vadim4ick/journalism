import axios from "axios";
import https from "node:https";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

export const $serverApi = axios.create({
  baseURL: serverUrl ? `${serverUrl}/api/v1` : undefined,
  headers: { Accept: "application/json" },
  timeout: 15000,
  ...(process.env.NODE_ENV === "development" && {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  }),
});

$serverApi.interceptors.request.use((config) => {
  if (!serverUrl) throw new Error("Не задан NEXT_PUBLIC_SERVER_URL");
  return config;
});

if (process.env.NODE_ENV === "development") {
  $serverApi.interceptors.response.use(
    (response) => {
      console.dir({
        request: `${response.config.method?.toUpperCase() ?? "GET"} ${response.config.url}`,
        params: response.config.params,
        status: response.status,
        data: response.data,
      }, { depth: null });
      return response;
    },
    (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        console.dir({
          request: `${error.config?.method?.toUpperCase() ?? "GET"} ${error.config?.url}`,
          params: error.config?.params,
          status: error.response.status,
          data: error.response.data,
        }, { depth: null });
      }
      return Promise.reject(error);
    },
  );
}
