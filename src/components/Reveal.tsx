import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent } from "@mui/material";
import { CREDENTIAL_HEIGHT } from "../App";

export type RevealProps = {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
  onValidate: (index: number, validated: boolean) => void;
};

export default function Reveal(props: RevealProps) {
  return (
    <Card elevation={6}>
      <CardHeader
        title={`Reveal Document ${props.index + 1}`}
        titleTypographyProps={{ variant: "subtitle1" }}
      />
      <CardContent>
        <Editor
          height={CREDENTIAL_HEIGHT}
          defaultLanguage="json"
          defaultValue={props.value}
          theme="vs-dark"
          options={{ lineNumbers: false, minimap: { enabled: false } }}
          onChange={(value, _) => value && props.onChange(props.index, value)}
          onValidate={(markers) =>
            props.onValidate(props.index, markers.length === 0)
          }
        />
      </CardContent>
    </Card>
  );
}
