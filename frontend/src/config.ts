export const BASE_PATH = import.meta.env.VITE_BASE_PATH
  ? import.meta.env.VITE_BASE_PATH
  : "";
export const BACKEND_URL = import.meta.env.VITE_FOODGETHER_BACKEND_URL
  ? import.meta.env.VITE_FOODGETHER_BACKEND_URL
  : "http://localhost:3000";

export const GRPC_URL = import.meta.env.VITE_FOODGETHER_GRPC_URL
  ? import.meta.env.VITE_FOODGETHER_GRPC_URL
  : "http://localhost:4001";
