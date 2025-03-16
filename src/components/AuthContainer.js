import { Stack } from "@mui/material";

export default function AuthContainer({ children }) {
  return (
    <Stack direction="column" justifyContent="center" height="100vh">
      {children}
    </Stack>
  );
}
