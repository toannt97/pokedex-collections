import { createContext } from "react";

// The element Layout renders above the footer, where floating actions such as FloatingButton go.
export const FloatingActionsContext = createContext<HTMLElement | null>(null);
