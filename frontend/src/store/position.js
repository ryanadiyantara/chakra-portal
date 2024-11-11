import { create } from "zustand";

export const usePositionStore = create((set) => ({
  positions: [],
  setPosition: (positions) => set({ positions }),

  createPosition: async (newPosition) => {
    if (!newPosition.position) {
      return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch("/api/positions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPosition),
    });
    const data = await res.json();
    set((state) => ({ positions: [...state.positions, data.data] }));
    return { success: true, message: "Position created successfully" };
  },

  fetchPosition: async () => {
    const res = await fetch("/api/positions");
    const data = await res.json();
    set({ positions: data.data });
  },

  deletePosition: async (pid) => {
    const res = await fetch(`/api/positions/${pid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      positions: state.positions.filter((position) => position._id !== pid),
    }));
    return { success: true, message: data.message };
  },

  updatePosition: async (pid, updatedPosition) => {
    const res = await fetch(`/api/positions/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPosition),
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      positions: state.positions.map((position) => (position._id === pid ? data.data : position)),
    }));
    return { success: true, message: data.message };
  },
}));
