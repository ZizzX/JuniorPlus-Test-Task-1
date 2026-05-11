import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));

  const isAuthenticated = computed(() => !!token.value);

  function setToken(newToken: string | null) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  }

  function logout() {
    setToken(null);
  }

  return {
    token,
    isAuthenticated,
    setToken,
    logout,
  };
});
