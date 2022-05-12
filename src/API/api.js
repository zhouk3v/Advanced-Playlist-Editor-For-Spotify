//TODO: add renew token function
export const getJSON = async (url) => {
  const token = localStorage.getItem("accesstoken");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  return json;
};
