function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(/runme_token=([^;]+)/);
  return match ? match[1] : null;
}

function setToken(token: string) {
  document.cookie = `runme_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

function clearToken() {
  document.cookie = "runme_token=; path=/; max-age=0";
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return res.json();
}

export const api = {
  auth: {
    logout: () => {
      clearToken();
      window.location.href = "/login";
    },
  },
  profile: {
    get: () =>
      fetchAPI("/api/profile"),
    update: (data: any) =>
      fetchAPI("/api/profile", { method: "PUT", body: JSON.stringify(data) }),
  },
  projects: {
    list: () =>
      fetchAPI("/api/projects"),
    create: (data: any) =>
      fetchAPI("/api/projects", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      fetchAPI(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI(`/api/projects/${id}`, { method: "DELETE" }),
  },
  experience: {
    list: () =>
      fetchAPI("/api/experience"),
    create: (data: any) =>
      fetchAPI("/api/experience", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      fetchAPI(`/api/experience/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI(`/api/experience/${id}`, { method: "DELETE" }),
  },
  skills: {
    list: () =>
      fetchAPI("/api/skills"),
    create: (data: any) =>
      fetchAPI("/api/skills", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      fetchAPI(`/api/skills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI(`/api/skills/${id}`, { method: "DELETE" }),
  },
  theme: {
    get: () =>
      fetchAPI("/api/theme"),
    update: (data: any) =>
      fetchAPI("/api/theme", { method: "PUT", body: JSON.stringify(data) }),
  },
  github: {
    refresh: () =>
      fetchAPI("/api/github/refresh", { method: "POST" }),
  },
  portfolio: {
    get: (username: string) =>
      fetchAPI(`/api/portfolio/${username}`),
  },
};

export { getToken, setToken, clearToken };
