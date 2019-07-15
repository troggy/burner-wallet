const getFieldName = (name, account) => (account ? `${account}${name}` : name);

export const getStoredValue = (name, account) =>
  localStorage.getItem(getFieldName(name, account));

export const storeValues = (params, account) => {
  const keys = Object.keys(params);
  const values = Object.values(params);
  keys.forEach((key, index) => {
    const value = values[index];
    const name = getFieldName(key, account);
    localStorage.setItem(name, value);
  });
};
