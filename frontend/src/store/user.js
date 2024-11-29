import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  positions: [],
  departments: [],
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
      body: formData,
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ users: [...state.users, data.data] }));
    return { success: true, message: "User created successfully" };
  },

  fetchUser: async () => {
    const res = await fetch("/api/users");
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
      body: formData,
    });

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
      body: formData,
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      users: state.users.filter((user) => user._id !== pid),
    }));
    return { success: true, message: data.message };
  },

  getDepartmentData: async () => {
    const res = await fetch("/api/departments");
    const data = await res.json();
    set({ departments: data.data });
  },

  getPositionData: async () => {
    const res = await fetch("/api/positions");
    const data = await res.json();
    set({ positions: data.data });
  },

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

  // refreshToken: async () => {
  //   const cookies = document.cookie.split(";").reduce((acc, cookie) => {
  //     const [key, value] = cookie.split("=");
  //     acc[key.trim()] = value;
  //     return acc;
  //   }, {});

  //   const refreshToken = cookies?.jwt;

  //   if (!refreshToken) {
  //     return { success: false, message: "No refresh token found" };
  //   }

  //   const res = await fetch("/api/auth/refresh", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ refreshToken }),
  //   });

  //   const data = await res.json();

  //   if (!data.success) {
  //     return { success: false, message: "Failed to refresh token" };
  //   }

  //   if (data.accessToken) {
  //     localStorage.setItem("accessToken", data.accessToken);
  //     return { success: true, message: "Token refreshed successfully" };
  //   }
  // },
}));
