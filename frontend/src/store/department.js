import { create } from "zustand";

export const useDepartmentStore = create((set) => ({
  departments: [],
  setDepartments: (departments) => set({ departments }),

  createDepartment: async (newDepartment) => {
    if (!newDepartment.department_name) {
      return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch("/api/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDepartment),
    });
    const data = await res.json();
    set((state) => ({ departments: [...state.departments, data.data] }));
    return { success: true, message: "Department created successfully" };
  },

  fetchDepartments: async () => {
    const res = await fetch("/api/departments");
    const data = await res.json();
    set({ departments: data.data });
  },

  deleteDepartment: async (pid) => {
    const res = await fetch(`/api/departments/${pid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      departments: state.departments.filter((department) => department._id !== pid),
    }));
    return { success: true, message: data.message };
  },

  updateDepartment: async (pid, updatedDepartment) => {
    const res = await fetch(`/api/departments/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDepartment),
    });
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
}));
