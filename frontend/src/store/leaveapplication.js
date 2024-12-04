import { create } from "zustand";

const token = localStorage.getItem("accessToken");

export const useLeaveAppStore = create((set) => ({
  leaveapps: [],
  setLeaveApp: (leaveapps) => set({ leaveapps }),

  createLeaveApp: async (newLeaveApp) => {
    if (
      !newLeaveApp.leave_startDate ||
      !newLeaveApp.leave_endDate ||
      !newLeaveApp.type ||
      !newLeaveApp.leave_status
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/leaveapps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newLeaveApp),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
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
    if (!updatedLeaveApp.department_name) {
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
      leaveapps: state.leaveapps.map((leaveapp) =>
        department._id === pid ? data.data : department
      ),
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
      leaveapps: state.leaveapps.filter((department) => department._id !== pid),
    }));
    return { success: true, message: data.message };
  },
}));
