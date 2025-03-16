import { TextField, FormLabel, FormControl } from "@mui/material";

export default function AuthForm({ label, name, type, value, onChange, error, helperText }) {
  return (
    <FormControl fullWidth>
      <FormLabel>{label}</FormLabel>
      <TextField
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        variant="outlined"
      />
    </FormControl>
  );
}
