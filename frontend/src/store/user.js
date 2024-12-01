import { create } from "zustand";

const token = localStorage.getItem("accessToken");

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

const userInfo = token ? parseJwt(token)?.UserInfo : null;

export const useUserStore = create((set) => ({
  users: [],
  positions: [],
  departments: [],
  currentUser: userInfo,
  setUser: (users) => set({ users }),

  createUser: async (newUser) => {
    if (
      !newUser.user_name ||
      !newUser.email ||
      !newUser.dateBirth ||
      !newUser.department_id ||
      !newUser.position_id ||
      !newUser.profilePicture ||
      !newUser.startDate
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("user_name", newUser.user_name);
    formData.append("email", newUser.email);
    formData.append("dateBirth", newUser.dateBirth);
    formData.append("department_id", newUser.department_id);
    formData.append("position_id", newUser.position_id);
    formData.append("file", newUser.profilePicture);
    formData.append("startDate", newUser.startDate);

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session expired, please log in again`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ users: [...state.users, data.data] }));
    return { success: true, message: "User created successfully" };
  },

  fetchUser: async () => {
    const res = await fetch("/api/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session expired, please log in again`;
      return;
    }

    const data = await res.json();
    set({ users: data.data });
  },

  updateUser: async (pid, updatedUser) => {
    if (
      !updatedUser.user_name ||
      !updatedUser.email ||
      !updatedUser.dateBirth ||
      !updatedUser.department_id ||
      !updatedUser.position_id ||
      !updatedUser.profilePicture ||
      !updatedUser.startDate
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("user_name", updatedUser.user_name);
    formData.append("email", updatedUser.email);
    formData.append("dateBirth", updatedUser.dateBirth);
    formData.append("department_id", updatedUser.department_id);
    formData.append("position_id", updatedUser.position_id);
    formData.append("file", updatedUser.profilePicture);
    formData.append("startDate", updatedUser.startDate);

    const res = await fetch(`/api/users/${pid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session expired, please log in again`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      users: state.users.map((user) => (user._id === pid ? data.data : user)),
    }));
    return { success: true, message: data.message };
  },

  terminatedUser: async (pid) => {
    const now = new Date();
    const formattedDate = now.toISOString();

    const formData = new FormData();
    formData.append("endDate", formattedDate);
    formData.append("na", true);

    const res = await fetch(`/api/users/${pid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session expired, please log in again`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      users: state.users.filter((user) => user._id !== pid),
    }));
    return { success: true, message: data.message };
  },

  changePassword: async (pid, currentEmail, changedPassword) => {
    if (!changedPassword.old_password || !changedPassword.new_password) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("old_password", changedPassword.old_password);
    formData.append("new_password", changedPassword.new_password);
    formData.append("currentEmail", currentEmail);

    const res = await fetch(`/api/users/${pid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session expired, please log in again`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      users: state.users.filter((user) => user._id !== pid),
    }));
    return { success: true, message: data.message };
  },

  getDepartmentData: async () => {
    const res = await fetch("/api/departments", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session expired, please log in again`;
      return;
    }

    const data = await res.json();
    set({ departments: data.data });
  },

  getPositionData: async () => {
    const res = await fetch("/api/positions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session expired, please log in again`;
      return;
    }

    const data = await res.json();
    set({ positions: data.data });
  },

  // Auth
  loginUser: async (newUser) => {
    if (!newUser.email || !newUser.user_password) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();

    if (!data.success) return { success: false, message: data.accessToken };

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }

    set((state) => ({ users: [...state.users, data.data] }));
    return { success: true, message: "Login successfully" };
  },
}));
