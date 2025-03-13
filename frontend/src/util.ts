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

export const printDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
};

export const getDate = (): Date => {
  return new Date(JSON.parse(sessionStorage.getItem("date")));
};
