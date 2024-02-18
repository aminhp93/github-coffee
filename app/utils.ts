export const getRequest = (token: string, request: any) => {
  if (!request) return null;
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    url: request!.url,
  };
};
