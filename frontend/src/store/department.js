import { create } from "zustand";

const token = localStorage.getItem("accessToken");

export const useDepartmentStore = create((set) => ({
  departments: [],
  setDepartment: (departments) => set({ departments }),

  // Function to create a new department
  createDepartment: async (newDepartment) => {
    if (!newDepartment.department_name) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newDepartment),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({ departments: [...state.departments, data.data] }));
    return { success: true, message: "Department created successfully" };
  },

  // Function to fetch all departments
  fetchDepartment: async () => {
    const res = await fetch("/api/departments", {
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

    set({ departments: data.data });
  },

  // Function to update a department by ID
  updateDepartment: async (pid, updatedDepartment) => {
    if (!updatedDepartment.department_name) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch(`/api/departments/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedDepartment),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      departments: state.departments.map((department) =>
        department._id === pid ? data.data : department
      ),
    }));
    return { success: true, message: data.message };
  },

  // Function to delete a department by ID
  deleteDepartment: async (pid) => {
    const deletedDepartment = {
      na: true,
      del: true,
    };

    const res = await fetch(`/api/departments/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deletedDepartment),
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = `/login?message=Session Expired`;
      return;
    }

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      departments: state.departments.filter((department) => department._id !== pid),
    }));
    return { success: true, message: data.message };
  },
}));
