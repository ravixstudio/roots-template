import { create } from "zustand";
import { User } from "@/types";

export const useUserStore = create<{
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  isLoading: true,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
