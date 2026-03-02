import { useState, useCallback } from "react";

const CONSENT_KEY = "orola_location_consent";

export function useLocationConsent() {
  const [consented, setConsented] = useState(
    () => localStorage.getItem(CONSENT_KEY) === "true"
  );

  const grant = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "true");
    setConsented(true);
  }, []);

  return { consented, grant };
}
