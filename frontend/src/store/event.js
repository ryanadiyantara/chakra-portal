import { create } from "zustand";

const token = localStorage.getItem("accessToken");

export const useEventStore = create((set) => ({
  events: [],
  setEvent: (events) => set({ events }),

  // Function to create a new event
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
    formData.append("event_name", newEvent.event_name);
    formData.append("file", newEvent.poster);
    formData.append("event_startDate", newEvent.event_startDate);
    formData.append("event_endDate", newEvent.event_endDate);
    formData.append("description", newEvent.description);

    const res = await fetch("/api/events", {
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
    set((state) => ({ events: [...state.events, data.data] }));
    return { success: true, message: "Event created successfully" };
  },

  fetchEvent: async () => {
    const res = await fetch("/api/events", {
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

    set({ events: data.data });
  },

  updateEvent: async (pid, updatedEvent) => {
    if (
      !updatedEvent.event_name ||
      !updatedEvent.poster ||
      !updatedEvent.event_startDate ||
      !updatedEvent.event_endDate ||
      !updatedEvent.description
    ) {
      return { success: false, message: "Please fill in all fields." };
    }

    const formData = new FormData();
    formData.append("file", updatedEvent.poster);
    formData.append("event_name", updatedEvent.event_name);
    formData.append("event_startDate", updatedEvent.event_startDate);
    formData.append("event_endDate", updatedEvent.event_endDate);
    formData.append("description", updatedEvent.description);

    const res = await fetch(`/api/events/${pid}`, {
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
      events: state.events.map((event) => (event._id === pid ? data.data : event)),
    }));
    return { success: true, message: data.message };
  },

  deleteEvent: async (pid) => {
    const deletedEvent = {
      na: true,
      del: true,
    };

    const res = await fetch(`/api/events/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deletedEvent),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      events: state.events.filter((event) => event._id !== pid),
    }));
    return { success: true, message: data.message };
  },
}));
