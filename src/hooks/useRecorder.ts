import { useState, useRef, useCallback, useEffect } from "react";

const MAX_DURATION = 60; // seconds

interface RecorderState {
  status: "idle" | "recording" | "done" | "error";
  duration: number;
  blob: Blob | null;
  error: string | null;
}

export function useRecorder() {
  const [state, setState] = useState<RecorderState>({
    status: "idle",
    duration: 0,
    blob: null,
    error: null,
  });

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const startTime = useRef(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
    }
    mediaRecorder.current?.stream
      .getTracks()
      .forEach((t) => t.stop());
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback(async () => {
    chunks.current = [];
    setState({ status: "idle", duration: 0, blob: null, error: null });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        const blob = new Blob(chunks.current, { type: recorder.mimeType });
        setState((s) => ({ ...s, status: "done", blob }));
      };

      recorder.onerror = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        setState((s) => ({ ...s, status: "error", error: "录音失败" }));
      };

      recorder.start(200);
      startTime.current = Date.now();
      setState((s) => ({ ...s, status: "recording" }));

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        setState((s) => ({ ...s, duration: Math.min(elapsed, MAX_DURATION) }));
        if (elapsed >= MAX_DURATION) {
          recorder.stop();
        }
      }, 250);
    } catch {
      setState({
        status: "error",
        duration: 0,
        blob: null,
        error: "需要麦克风权限",
      });
    }
  }, []);

  const stop = useCallback(() => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    cleanup();
    chunks.current = [];
    setState({ status: "idle", duration: 0, blob: null, error: null });
  }, [cleanup]);

  return { ...state, start, stop, reset, maxDuration: MAX_DURATION };
}
