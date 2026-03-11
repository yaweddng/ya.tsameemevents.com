import { useAuth as useAuthContext } from '../context/AuthContext';

export type { User } from '../context/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};
