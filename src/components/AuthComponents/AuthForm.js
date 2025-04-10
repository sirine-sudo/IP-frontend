import { TextField, FormLabel, FormControl } from "@mui/material";
import './style.css';

export default function AuthForm({ label, name, type, value, onChange, error, helperText }) {
  return (
    <div>
      <FormControl fullWidth>
        <FormLabel>{label}</FormLabel>
        <input
          className="text-input"    
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          variant="outlined"
        />
      </FormControl>
    </div>
  );
}
