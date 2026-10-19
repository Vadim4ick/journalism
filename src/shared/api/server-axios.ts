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
