import { create } from "zustand";

export const useEventStore = create((set) => ({
  events: [],
  setEvent: (events) => set({ events }),

  createEvent: async (newEvent) => {
    if (
      !newEvent.event_name ||
      !newEvent.poster ||
      !newEvent.event_startDate ||
      !newEvent.event_endDate ||
      !newEvent.description
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("file", newEvent.poster);
    formData.append("event_name", newEvent.event_name);
    formData.append("event_startDate", newEvent.event_startDate);
    formData.append("event_endDate", newEvent.event_endDate);
    formData.append("description", newEvent.description);

    const res = await fetch("/api/events", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ events: [...state.events, data.data] }));
    return { success: true, message: "Event created successfully" };
  },

  fetchEvent: async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    set({ events: data.data });
  },

  deleteEvent: async (pid) => {
    const res = await fetch(`/api/events/${pid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      events: state.events.filter((event) => event._id !== pid),
    }));
    return { success: true, message: data.message };
  },

  updateEvent: async (pid, updatedEvent) => {
    const res = await fetch(`/api/events/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      events: state.events.map((event) => (event._id === pid ? data.data : event)),
    }));
    return { success: true, message: data.message };
  },
}));
