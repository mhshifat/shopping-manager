import { BASE_API_URI } from "./config";

export default async (method, path, data) => {
  const API_URI = BASE_API_URI + path;
  try {
    const res = await (
      await fetch(API_URI, {
        method: method.toUpperCase(),
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.token
        }
      })
    ).json();
    if (res.errorCode) {
      return Promise.reject(res);
    }
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};
