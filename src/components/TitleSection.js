import { Box, Typography } from "@mui/material";

export default function TitleSection({ title, text }) {
  return (
    <Box sx={{ width: "100%", textAlign: "left", mb: 2 }}>
      <Typography variant="h5" fontWeight="bold">
        {title}
      </Typography>
      {text && (
        <Typography variant="body3" sx={{ color: "gray", mt: 1 }}>
          {text}
        </Typography>
      )}
     </Box>
  );
}
