import { create } from "zustand";

const token = localStorage.getItem("accessToken");

export const useLeaveAppStore = create((set) => ({
  leaveapps: [],
  setLeaveApp: (leaveapps) => set({ leaveapps }),

  // Function to create a new leave application
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

    // update the ui immediately, without needing a refresh
    set((state) => ({ leaveapps: [...state.leaveapps, data.data] }));
    return { success: true, message: "Leave Application created successfully" };
  },

  // Function to fetch all leave applications
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

  // Function to update a leave application by ID
  updateLeaveApp: async (pid, updatedLeaveApp) => {
    if (
      !updatedLeaveApp.type ||
      !updatedLeaveApp.leave_startDate ||
      !updatedLeaveApp.leave_endDate
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("file", updatedLeaveApp.attachment);
    formData.append("type", updatedLeaveApp.type);
    formData.append("leave_startDate", updatedLeaveApp.leave_startDate);
    formData.append("leave_endDate", updatedLeaveApp.leave_endDate);

    const res = await fetch(`/api/leaveapps/${pid}`, {
      method: "PUT",
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

    // update the ui immediately, without needing a refresh
    set((state) => ({
      leaveapps: state.leaveapps.map((leaveapp) => (leaveapp._id === pid ? data.data : leaveapp)),
    }));
    return { success: true, message: data.message };
  },

  // Function to update approval status of a leave application by ID
  approvalLeaveApp: async (pid, approval) => {
    const formData = new FormData();
    formData.append("leave_status", approval);

    const res = await fetch(`/api/leaveapps/${pid}`, {
      method: "PUT",
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

    // update the ui immediately, without needing a refresh
    set((state) => ({
      leaveapps: state.leaveapps.map((leaveapp) => (leaveapp._id === pid ? data.data : leaveapp)),
    }));
    return { success: true, message: data.message };
  },
}));
