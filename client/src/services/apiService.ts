import { getToken } from "./tokenService";

interface RequestOptions {
  query?: object;
  method: string;
  body?: any;
  headers?: { [key: string]: string };
  next?: { [key: string]: any };
}

export const BASE_URL = process.env.API_URL;

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const error = await response.json();

    if ([401, 400].includes(response.status)) {
      throw {
        key: response.status,
        message: error || "Something went wrong",
      };
    } else if (error.errors) {
      throw new Error(error.errors?.join("\n"));
    } else {
      throw error;
    }
  }

  return response.json();
};

const apiRequest = async (
  url: string,
  options: RequestOptions = { method: "GET" }
): Promise<any> => {
  const { method, body, headers, query, next } = options;
  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${getToken()}`,
      ...headers,
    },
    body: JSON.stringify(body),
  };

  if (next) {
    requestOptions.next = next;
  }

  if (query) {
    const queryParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((value) =>
          queryParams.append(`${key}[]`, value ? value : "")
        );
      } else {
        queryParams.append(key, value ? value : "");
      }
    });

    url = `${url}?${queryParams.toString()}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, requestOptions);

  return handleResponse(response);
};

export const ApiService = {
  get: async (
    url: string,
    query?: object,
    headers?: { [key: string]: string },
    next?: { [key: string]: any }
  ): Promise<any> => {
    return await apiRequest(url, { method: "GET", query, headers, next });
  },
  post: (url: string, body: any, headers?: { [key: string]: string }) =>
    apiRequest(url, { method: "POST", body, headers }),
  put: (url: string, body: any, headers?: { [key: string]: string }) =>
    apiRequest(url, { method: "PUT", body, headers }),
  delete: (url: string, body: any, headers?: { [key: string]: string }) =>
    apiRequest(url, { method: "DELETE", body, headers }),
};
