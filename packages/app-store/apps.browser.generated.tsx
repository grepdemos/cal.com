/**
    This file is autogenerated using the command `yarn app-store:build --watch`.
    Don't modify this file manually.
**/
import dynamic from "next/dynamic";

export const InstallAppButtonMap = {
  exchange2013calendar: dynamic(() => import("./exchange2013calendar/components/InstallAppButton")),
  exchange2016calendar: dynamic(() => import("./exchange2016calendar/components/InstallAppButton")),
  office365video: dynamic(() => import("./office365video/components/InstallAppButton")),
  vital: dynamic(() => import("./vital/components/InstallAppButton")),
};
export const AppSettingsComponentsMap = {
  "general-app-settings": dynamic(
    () => import("./templates/general-app-settings/components/AppSettingsInterface")
  ),
  weather_in_your_calendar: dynamic(
    () => import("./weather_in_your_calendar/components/AppSettingsInterface")
  ),
  zapier: dynamic(() => import("./zapier/components/AppSettingsInterface")),
};
export const EventTypeAddonMap = {
  fathom: dynamic(() => import("./fathom/components/EventTypeAppCardInterface")),
  ga4: dynamic(() => import("./ga4/components/EventTypeAppCardInterface")),
  giphy: dynamic(() => import("./giphy/components/EventTypeAppCardInterface")),
  gtm: dynamic(() => import("./gtm/components/EventTypeAppCardInterface")),
  plausible: dynamic(() => import("./plausible/components/EventTypeAppCardInterface")),
  qr_code: dynamic(() => import("./qr_code/components/EventTypeAppCardInterface")),
  rainbow: dynamic(() => import("./rainbow/components/EventTypeAppCardInterface")),
  stripepayment: dynamic(() => import("./stripepayment/components/EventTypeAppCardInterface")),
  "booking-pages-tag": dynamic(
    () => import("./templates/booking-pages-tag/components/EventTypeAppCardInterface")
  ),
  "event-type-app-card": dynamic(
    () => import("./templates/event-type-app-card/components/EventTypeAppCardInterface")
  ),
};
