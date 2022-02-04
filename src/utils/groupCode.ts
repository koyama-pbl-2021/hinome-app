export const genarateGroupCode = (digit: number) => {
  const c = 'abcdefghijkmnpqrstuvwxyz23456789';
  const cl = c.length;
  let r = '';
  for (let i = 0; i < digit; i++) {
    r += c[Math.floor(Math.random() * cl)];
  }
  return r;
};
