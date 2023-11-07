export default function useLocalStorage() {
  const key = 'Connection_Zipcode_State';

  const setConnection = (data: Rule[]) => {
    window.localStorage.setItem(key, JSON.stringify(data));
  }

  const getConnection = ():Rule[] => {
    const data = window.localStorage.getItem(key);

    return data ? JSON.parse(data) : undefined;
  }

  return { getConnection, setConnection }
}