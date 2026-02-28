import { supabase } from "./supabase";

let currentAudio: HTMLAudioElement | null = null;

export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from("sounds").getPublicUrl(path);
  return data.publicUrl;
}

export function playAudio(url: string): HTMLAudioElement {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
  }
  currentAudio = new Audio(url);
  currentAudio.play();
  return currentAudio;
}

export function pauseAudio() {
  currentAudio?.pause();
}

export function getCurrentAudio() {
  return currentAudio;
}
