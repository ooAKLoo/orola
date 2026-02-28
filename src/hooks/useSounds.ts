import { useState, useEffect } from "react";
import { supabase, type Sound } from "../lib/supabase";
import { getBoundingBox } from "../lib/geo";

const SEARCH_RADIUS = 5000; // 5km

export function useSounds(lat: number | null, lng: number | null) {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lat === null || lng === null) return;

    const box = getBoundingBox(lat, lng, SEARCH_RADIUS);

    const fetchSounds = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("sounds")
        .select("*")
        .gte("latitude", box.minLat)
        .lte("latitude", box.maxLat)
        .gte("longitude", box.minLng)
        .lte("longitude", box.maxLng)
        .order("created_at", { ascending: false });

      if (!error && data) setSounds(data as Sound[]);
      setLoading(false);
    };

    fetchSounds();
  }, [lat, lng]);

  return { sounds, loading, setSounds };
}
