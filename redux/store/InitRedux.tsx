"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store";
import { setSettings } from "@/redux/globalSlice";

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