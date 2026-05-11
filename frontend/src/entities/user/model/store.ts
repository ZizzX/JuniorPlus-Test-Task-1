import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "./types";
import { api } from "@/shared/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await api.get("/users/info");
      user.value = response.data;
    } catch (e) {
      logout();
    }
  }

  function setToken(newToken: string | null) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  }

  function setUser(newUser: User | null) {
    user.value = newUser;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    fetchUser,
    setToken,
    setUser,
    logout,
  };
});
