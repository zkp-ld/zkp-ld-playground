import { useEffect, useState } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

export type VersionDropdownProps = {
  currentVersion: string;
};

export default function VersionDropdown(props: VersionDropdownProps) {
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    fetch("/versions.json")
      .then((response) => response.json())
      .then((data) => setVersions(data));
  }, []);

  const handleChange = (event: SelectChangeEvent<string>) => {
    window.location.href = `/${event.target.value}`;
  };

  return (
    <FormControl variant="standard">
      <Select value={props.currentVersion} onChange={handleChange}>
        {versions.map((version) => (
          <MenuItem key={version} value={`v${version}`}>
            {`v${version}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
