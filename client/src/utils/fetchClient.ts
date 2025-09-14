/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'http://localhost:3005';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null,
  isFormData = false,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    if (isFormData) {
      options.body = data;
    } else {
      options.body = JSON.stringify(data);
      options.headers = {
        'Content-Type': 'application/json; charset=UTF-8',
      };
    }
  }

  return fetch(BASE_URL + url, options).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data, true),
  delete: <T>(url: string) => request<T>(url, 'DELETE'),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data, true),
};
