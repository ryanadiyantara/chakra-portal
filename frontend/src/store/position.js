import { create } from "zustand";

const token = localStorage.getItem("accessToken");

export const usePositionStore = create((set) => ({
  positions: [],
  setPosition: (positions) => set({ positions }),

  // Function to create a new position
  createPosition: async (newPosition) => {
    if (!newPosition.position_name || !newPosition.department_id) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/positions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPosition),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({ positions: [...state.positions, data.data] }));
    return { success: true, message: "Position created successfully" };
  },

  // Function to fetch all positions
  fetchPosition: async () => {
    const res = await fetch("/api/positions", {
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

    set({ positions: data.data });
  },

  // Function to update a position by ID
  updatePosition: async (pid, updatedPosition) => {
    if (!updatedPosition.position_name || !updatedPosition.department_id) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch(`/api/positions/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPosition),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      positions: state.positions.map((position) => (position._id === pid ? data.data : position)),
    }));
    return { success: true, message: data.message };
  },

  // Function to delete a position by ID
  deletePosition: async (pid) => {
    const deletedPosition = {
      na: true,
      del: true,
    };

    const res = await fetch(`/api/positions/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deletedPosition),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      positions: state.positions.filter((position) => position._id !== pid),
    }));
    return { success: true, message: data.message };
  },
}));
