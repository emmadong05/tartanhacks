export type Ok<T> = { data: T; message: string; status: number };

class Api {
  async get<T>(route: string, params?: Record<string, string>): Promise<T> {
    // Serialize params into a query string
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    
    const token = localStorage.getItem("token");

    const response = await fetch(`http://127.0.0.1:4000/${route}${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ?? "",
      }
    });

    const parsed = await response.json();
    if (response.ok) {
      return parsed.data as T;
    } else {
      throw new Error(parsed.message);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T>(route: string, body: any): Promise<T> {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://127.0.0.1:4000/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ?? "",
      },
      body: JSON.stringify(body),
    });

    const parsed = await response.json();
    if (response.ok) {
      return parsed.data as T;
    } else {
      throw new Error(parsed.message);
    }
  }
}

const api = new Api();

export default api;