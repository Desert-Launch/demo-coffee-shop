"use client";

import { create } from "zustand";

import type { StaffMember } from "@/types";

/** The demo's stand-in for an auth session. Nothing is checked. */
export const STAFF_ROSTER: StaffMember[] = [
  { id: "staff_reem", name: "Barista 1", role: "Head barista", initials: "B1" },
  { id: "staff_deniz", name: "Barista 2", role: "Bar", initials: "B2" },
  { id: "staff_joseph", name: "Roaster 1", role: "Roaster", initials: "R1" },
  { id: "staff_hala", name: "Shift Lead 1", role: "Shift lead", initials: "S1" },
];

interface StaffState {
  current: StaffMember;
  setCurrent: (id: string) => void;
}

export const useStaffStore = create<StaffState>()((set) => ({
  current: STAFF_ROSTER[0],
  setCurrent: (id) =>
    set((state) => ({
      current: STAFF_ROSTER.find((member) => member.id === id) ?? state.current,
    })),
}));
