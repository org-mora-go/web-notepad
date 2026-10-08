import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";

export const RIGHT_PANEL_IDS = ["groups-panel", "bookmarks-panel", "shortcuts-panel"];

// The SHORTCUT command is hidden on mobile, so only the groups and bookmarks panels can be opened there.
export const RIGHT_PANEL_VIEWPORTS = [
  { viewport: DESKTOP_VIEWPORT, panelIds: RIGHT_PANEL_IDS },
  { viewport: MOBILE_VIEWPORT, panelIds: ["groups-panel", "bookmarks-panel"] },
];
