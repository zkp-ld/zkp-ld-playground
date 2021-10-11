import { useState } from "react";
import {
  Stack,
  Box,
  Avatar,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Grid,
} from "@mui/material";
import { brown } from "@mui/material/colors";
import Storage from "@mui/icons-material/Storage";
import Editor from "@monaco-editor/react";

import { ModeType } from "../App";

export type RegistryProps = {
  name: string;
  extDocs: Map<string, string>;
  mode: ModeType;
  onChange: (id: string, value: string) => void;
  onValidate: (id: string, validated: boolean) => void;
};

export default function Registry(props: RegistryProps) {
  const [selected, setSelected] = useState("");

  const handleSelectDoc = (key: string) => {
    setSelected(key);
  };

  const handleChange = (value: string) => {
    props.onChange(selected, value);
  };

  const handleValidate = (value: boolean) => {
    props.onValidate(selected, value);
  };

  return (
    <Stack>
      <Box sx={{ display: "flex", margin: 2, alignItems: "center" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: brown[500] }} aria-label="issuer">
            <Storage />
          </Avatar>
          <Typography color={brown[500]}>{props.name}</Typography>
        </Stack>
      </Box>

      <Box sx={{ padding: 2 }}>
        <Grid container>
          <Grid item xs={6}>
            <List dense sx={{ maxHeight: "76vh", overflow: "auto" }}>
              {Array.from(props.extDocs.keys()).map((key: string) => (
                <ListItemButton
                  key={`item-${key}`}
                  selected={key === selected}
                  onClick={(_) => handleSelectDoc(key)}
                >
                  <ListItemText primary={key} />
                </ListItemButton>
              ))}
            </List>
          </Grid>
          <Grid item xs={6}>
            <Editor
              height="76vh"
              path={selected}
              defaultLanguage="json"
              defaultValue={props.extDocs.get(selected)}
              theme={props.mode.monaco}
              options={{ lineNumbers: false, minimap: { enabled: false } }}
              onChange={(value, _) => value && handleChange(value)}
              onValidate={(markers) => {
                handleValidate(markers.length === 0);
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
