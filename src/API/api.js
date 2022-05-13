//TODO: add renew token function

export const getToken = () => {
  // TODO:
  const token = localStorage.getItem("accesstoken");
  return token;
};

export const getJSON = async (url) => {
  const token = getToken();
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
