export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const authFetch = async (
  url: string | URL,
  options: FetchOptions = {}
) => {
  const user = JSON.parse(localStorage.getItem("user-info") ?? "")?.state?.user;
  if (!user?.accessToken) return { ok: false };

  options.headers = {
    Authorization: `Bearer ${user.accessToken}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, options);

  return response;
};
