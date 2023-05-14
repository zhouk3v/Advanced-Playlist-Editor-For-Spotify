export const splitIntoChunks = <T>(
  arr: Array<T>,
  chunkSize: number
): Array<Array<T>> => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};
