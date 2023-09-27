import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent, Tooltip } from "@mui/material";
import { CREDENTIAL_HEIGHT, ModeType } from "../App";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export type RevealProps = {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
  onValidate: (index: number, validated: boolean) => void;
  mode: ModeType;
};

export default function Reveal(props: RevealProps) {
  return (
    <Card elevation={3}>
      <CardHeader
        title={`Redacted Credential ${props.index + 1}`}
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <Tooltip title="You can hide some attributes (1) by deleting their respective lines from here, or (2) by replacing them with a blank node id prefixed by `_:`, e.g., `_:abc`.">
            <HelpOutlineIcon />
          </Tooltip>
        }
      />

      <CardContent>
        <Editor
          height={CREDENTIAL_HEIGHT}
          defaultLanguage="json"
          defaultValue={props.value}
          theme={props.mode === "light" ? "light" : "vs-dark"}
          options={{ lineNumbers: "off", minimap: { enabled: false } }}
          onChange={(value, _) => value && props.onChange(props.index, value)}
          onValidate={(markers) =>
            props.onValidate(props.index, markers.length === 0)
          }
        />
      </CardContent>
    </Card>
  );
}
