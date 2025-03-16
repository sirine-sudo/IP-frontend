import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import React, { useState } from "react";

export default function ColorModeSelect() {
  const [darkMode, setDarkMode] = useState(false);
  return <IconButton onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Brightness7 /> : <Brightness4 />}</IconButton>;
}
