import { create } from "zustand";

type useOpenAppointmentStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useOpenAppointment = create<useOpenAppointmentStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
