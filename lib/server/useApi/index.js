"use server";

const apiHeaders = {
  "Content-Type": "application/json",
  "x-api-key": process.env.API_KEY,
};

export async function apiRequest(endpoint, params = {}) {
  try {
    const { headers: customHeaders, ...otherCustomParams } = params;
    let res = await fetch(`${process.env.API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY,
        ...customHeaders,
      },
      ...otherCustomParams,
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    let data = await res.json();

    return data;
  } catch (err) {
    return { ok: false, message: err };
  }
}
