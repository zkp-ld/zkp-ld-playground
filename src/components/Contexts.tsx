import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ModeType } from "../App";

type ContextsProps = {
  contexts: Map<string, string>;
  enableRemote: boolean;
  onChange: (id: string, value: string) => void;
  onValidate: (id: string, validated: boolean) => void;
  onEnableRemoteChange: (checked: boolean) => void;
  mode: ModeType;
};

export default function Contexts(props: ContextsProps) {
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
    <>
      <Box sx={{ padding: 1 }}>
        <Card elevation={3}>
          <CardHeader
            title="Cached Contexts"
            titleTypographyProps={{ variant: "subtitle1" }}
            action={
              <FormControlLabel
                control={
                  <Checkbox
                    inputProps={{ "aria-label": "controlled" }}
                    onChange={(e) =>
                      props.onEnableRemoteChange(e.target.checked)
                    }
                    checked={props.enableRemote}
                  />
                }
                label="Allow remote fetch if no cache"
              />
            }
          />
          <CardContent>
            <Grid container>
              <Grid item xs={6}>
                <List dense sx={{ maxHeight: "76vh", overflow: "auto" }}>
                  {Array.from(props.contexts.keys()).map((key) => (
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
                  defaultValue={props.contexts.get(selected)}
                  theme={props.mode === "light" ? "light" : "vs-dark"}
                  options={{ lineNumbers: "off", minimap: { enabled: false } }}
                  onChange={(value, _) => value && handleChange(value)}
                  onValidate={(markers) => {
                    handleValidate(markers.length === 0);
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
