export const timestamp = () => {
  return new Date().toLocaleTimeString();
};

export const searchInList = (list: any[], key: string, value: string) => {
  const filteredList = list.filter((item: any) => item[key] == value);
  if (filteredList.length > 0) {
    return filteredList[0];
  } else {
    return null;
  }
};
