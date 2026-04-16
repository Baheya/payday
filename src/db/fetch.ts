export const fetchData = async <T>(
  path: string,
  method: "get" | "put" | "post" | "delete" = "get",
  body?: { [key: string]: unknown },
): Promise<T> => {
  // const baseUrl = "/api";
  // const fetchUrl = new URL(baseUrl, path);
  // console.log(fetchUrl);
  const options: RequestInit = {
    method: method as string,
    body: body as unknown as BodyInit | null,
  };
  const response = await fetch(path, options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const data = await response.json();
  return data as T;
};
