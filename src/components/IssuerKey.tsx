import { useState } from "react";
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

import { ModeType } from "../App";
import { exampleKeys } from "./Issuer";

type IssuerKeyProps = {
  value: string;
  onChange: (value: string) => void;
  onValidate: (validated: boolean) => void;
  mode: ModeType;
  onExampleChange: (value: string) => void;
};

export default function IssuerKey(props: IssuerKeyProps) {
  const [keyID, setKeyID] = useState("did:example:issuer1#bbs-bls-key1");

  const handleKeyChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setKeyID(value);
    props.onExampleChange(value);
  };

  return (
    <Card elevation={3}>
      <CardHeader
        title="Keys"
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <FormControl fullWidth sx={{ minWidth: 120 }}>
            <InputLabel id="signing-key-label">signing key</InputLabel>
            <Select
              labelId="signing-key-label"
              id="signing-key"
              value={keyID}
              label="signing key"
              onChange={handleKeyChange}
              autoWidth
              style={{
                color:
                  props.mode.mui.palette.mode === "light"
                    ? "rgba(0,0,0,.85)"
                    : "rgba(255,255,255,0.85)",
              }}
            >
              {Object.keys(exampleKeys).map((k) => (
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
          height="8vh"
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
