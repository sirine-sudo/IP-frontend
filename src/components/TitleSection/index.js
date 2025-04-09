import { Box } from "@mui/material";
import './style.css'
export default function TitleSection({ title, text }) {
  return (
    <Box sx={{ width: "100%", textAlign: "left", mb: 0,mt:0 }}>
      <h1   fontWeight="bold">
        {title}
      </h1>
      {text && (
        <p  sx={{ color: "gray", }} className="sub-title">
          {text}
        </p>
      )}
     </Box>
  );
}
