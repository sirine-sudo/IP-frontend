import { Box, Typography } from "@mui/material";

export default function TitleSection({ title, text }) {
  return (
    <Box sx={{ width: "100%", textAlign: "left", mb: 2 }}>
      <h1   fontWeight="bold">
        {title}
      </h1>
      {text && (
        <p  sx={{ color: "gray", mt: 1 }}>
          {text}
        </p>
      )}
     </Box>
  );
}
