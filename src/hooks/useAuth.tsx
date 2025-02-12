const useAuth = (): boolean => {
  const loggedIn = localStorage.getItem("loggedIn");
  return loggedIn ? true : false;
};

export default useAuth;
