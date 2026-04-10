"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { setSettings } from "@/store/globalSlice";

export default function InitRedux({
  settings,
}: {
  settings: any;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (settings) {
      console.log("🔥 Dispatching settings to Redux:", settings); // ✅
      dispatch(setSettings(settings));
    }
  }, [settings, dispatch]);

  return null;
}
