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

export const useLeaveAppStore = create((set) => ({
  leaveapps: [],
  currentUser: userInfo,
  setLeaveApp: (leaveapps) => set({ leaveapps }),

  createLeaveApp: async (newLeaveApp, currentId) => {
    if (!newLeaveApp.type || !newLeaveApp.leave_startDate || !newLeaveApp.leave_endDate) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("type", newLeaveApp.type);
    formData.append("leave_startDate", newLeaveApp.leave_startDate);
    formData.append("leave_endDate", newLeaveApp.leave_endDate);
    formData.append("file", newLeaveApp.attachment);
    formData.append("currentId", currentId);

    const res = await fetch("/api/leaveapps", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ leaveapps: [...state.leaveapps, data.data] }));
    return { success: true, message: "Leave Application created successfully" };
  },

  fetchLeaveApp: async () => {
    const res = await fetch("/api/leaveapps", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    set({ leaveapps: data.data });
  },

  updateLeaveApp: async (pid, updatedLeaveApp) => {
    if (
      !updatedLeaveApp.leave_startDate ||
      !updatedLeaveApp.leave_endDate ||
      !updatedLeaveApp.type ||
      !updatedLeaveApp.leave_status
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch(`/api/leaveapps/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedLeaveApp),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      leaveapps: state.leaveapps.map((leaveapp) => (leaveapp._id === pid ? data.data : leaveapp)),
    }));
    return { success: true, message: data.message };
  },

  deleteLeaveApp: async (pid) => {
    const deletedLeaveApp = {
      na: true,
      del: true,
    };

    const res = await fetch(`/api/leaveapps/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deletedLeaveApp),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      leaveapps: state.leaveapps.filter((leaveapp) => leaveapp._id !== pid),
    }));
    return { success: true, message: data.message };
  },
}));
