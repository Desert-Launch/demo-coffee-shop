"use client";

import { create } from "zustand";

import type { StaffMember } from "@/types";

/** The demo's stand-in for an auth session. Nothing is checked. */
export const STAFF_ROSTER: StaffMember[] = [
  { id: "staff_reem", name: "Reem Al Hosani", role: "Head barista", initials: "RA" },
  { id: "staff_deniz", name: "Deniz Yilmaz", role: "Bar", initials: "DY" },
  { id: "staff_joseph", name: "Joseph Mwangi", role: "Roaster", initials: "JM" },
  { id: "staff_hala", name: "Hala Barakat", role: "Shift lead", initials: "HB" },
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
