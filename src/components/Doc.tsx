import Editor from "@monaco-editor/react";
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { ModeType } from "../App";
import { exampleDocs } from "./Issuer";

export type DocProps = {
  value: string;
  validated: boolean;
  onChange: (value: string) => void;
  onIssue: () => void;
  onValidate: (validated: boolean) => void;
  mode: ModeType;
  onExampleChange: (value: string) => void;
};

export default function Doc(props: DocProps) {
  const [example, setExample] = useState("");

  const handleExampleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setExample(value);
    props.onExampleChange(value);
  };

  return (
    <Card elevation={3}>
      <CardHeader
        title="Input Document"
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <FormControl fullWidth sx={{ minWidth: 120 }}>
            <InputLabel id="document-examples-label">Examples</InputLabel>
            <Select
              labelId="document-examples-label"
              id="document-examples"
              value={example}
              label="Examples"
              onChange={handleExampleChange}
              autoWidth
              style={{
                color:
                  props.mode.mui.palette.mode === "light"
                    ? "rgba(0,0,0,.85)"
                    : "rgba(255,255,255,0.85)",
              }}
            >
              {Object.keys(exampleDocs).map((k) => (
                <MenuItem key={k} value={k}>
                  {k}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />
      <CardContent>
        <Editor
          height="56vh"
          defaultLanguage="json"
          value={props.value}
          theme={props.mode.monaco}
          options={{ lineNumbers: false, minimap: { enabled: false } }}
          onChange={(value, _) => value && props.onChange(value)}
          onValidate={(markers) => props.onValidate(markers.length === 0)}
        />
      </CardContent>
    </Card>
  );
}
