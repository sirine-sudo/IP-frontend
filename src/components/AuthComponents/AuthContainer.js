import { Stack } from "@mui/material";
import './style.css'; // Make sure this is correctly imported

export default function AuthContainer({ children }) {
  return (
    <div className="auth-background" style={{ height: '100vh', width: '100%' }}>
      <Stack direction="column" justifyContent="center" height="100%" width="100%">
        {children}
      </Stack>
    </div>
  );
}
