import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.57.76:5000/api/";

export const publicRequest = axios.create({
    baseURL: BASE_URL,
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
});

userRequest.interceptors.request.use(
    async (config) => {
      const token = await fetchToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);



  
const fetchToken = async () => {
    const persistedRootString = await AsyncStorage.getItem("persist:root");
  
    if (persistedRootString) {
      try {
        const persistedRoot = JSON.parse(persistedRootString);
        const userDataString = persistedRoot?.user; 
        const userData = JSON.parse(userDataString); 
        const token = userData?.currentUser?.accessToken;
        return token;
      } catch (error) {
        console.error("Error parsing persistedRootString:", error);
      }
    }
    return null;
  };
  
  

