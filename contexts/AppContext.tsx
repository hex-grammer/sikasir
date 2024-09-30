import React, { useState, useMemo, useContext, useEffect, ReactNode } from 'react';
import is from 'is_js';
import axios, { AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  accessToken?: string;
  refreshToken?: string;
  [key: string]: any; // Extendable to any user properties
}

interface Cart {
  items: any[];
  customer: any | null;
  payAmount: number;
  discount: number;
}

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  temp: Record<string, any>;
  setTemp: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const axioInstance = axios.create();
axios.defaults.baseURL = Constants.manifest?.extra?.api_url;

const refreshAccessToken = async (refreshToken: string) => {
  return axios({
    method: 'PUT',
    url: '/authentications',
    data: { refreshToken },
  }).then((res) => res.data);
};

const logoutApi = async (refreshToken: string) => {
  return axios({
    method: 'DELETE',
    url: '/authentications',
    data: { refreshToken },
  }).then((res) => res.data);
};

const userManager = {
  async set(val: User) {
    await AsyncStorage.setItem('KASIRAJA_USER', JSON.stringify(val));
  },
  async get(): Promise<User | null> {
    try {
      const user = await AsyncStorage.getItem('KASIRAJA_USER');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },
  async remove() {
    await AsyncStorage.removeItem('KASIRAJA_USER');
  },
};

interface AppProviderProps {
  children: ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart>({
    items: [],
    customer: null,
    payAmount: 0,
    discount: 0,
  });
  const [temp, setTemp] = useState<Record<string, any>>({});

  const value = useMemo(
    () => ({
      user,
      setUser,
      cart,
      setCart,
      temp,
      setTemp,
    }),
    [user, cart, temp]
  );

  const getUser = async () => {
    const savedUser = await userManager.get();
    setUser(savedUser);
  };

  const axiosIntercept = async () => {
    axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const {
          status,
          data: { message },
        } = error.response;
        if (status === 401 && message === 'Unauthenticated.') {
          setUser(null);
          return;
        }

        if (status === 401 && message === 'Token maximum age exceeded') {
          const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
          originalRequest._retry = true;
          const user = await userManager.get();

          if (user?.refreshToken) {
            const res = await refreshAccessToken(user.refreshToken);
            const newUser = { ...user, accessToken: res.data.accessToken };

            setUser(newUser);
            userManager.set(newUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
            return axioInstance(originalRequest);
          }
        }

        throw error;
      }
    );
    await getUser();
  };

  useEffect(() => {
    axiosIntercept();
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useTempStore() {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error('useTempStore must be used within AppProvider');
  }

  const { temp, setTemp } = appContext;

  const resetTemp = () => setTemp({});

  return { temp, setTemp, resetTemp };
}

function useCart() {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error('useCart must be used within AppProvider');
  }

  const { cart, setCart } = appContext;

  const resetCart = () =>
    setCart({ ...cart, items: [], payAmount: 0, discount: 0 });

  return { cart, setCart, resetCart };
}

function useAuth() {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error('useAuth must be used within AppProvider');
  }

  const { user, setUser, setCart } = appContext;

  const isLoggedIn = (): boolean => {
    return is.not.empty(user) && is.not.null(user);
  };

  const persistUser = (user: User) => {
    userManager.set(user);
    setUser(user);
  };

  const logout = () => {
    if (user?.refreshToken) {
      logoutApi(user.refreshToken);
    }
    userManager.remove();
    setUser(null);
    setCart({ items: [], customer: null, payAmount: 0, discount: 0 });
  };

  return { user, isLoggedIn, persistUser, logout };
}

export { AppProvider, useAuth, useCart, useTempStore };
