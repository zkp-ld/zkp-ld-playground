import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent } from "@mui/material";
import { CREDENTIAL_HEIGHT, EDITOR_THEME } from "../App";

export type CredentialProps = {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
  onValidate: (index: number, validated: boolean) => void;
};

export default function Credential(props: CredentialProps) {
  return (
    <Card elevation={3}>
      <CardHeader
        title={`Verifiable Credential ${props.index + 1}`}
        titleTypographyProps={{ variant: "subtitle1" }}
      />
      <CardContent>
        <Editor
          height={CREDENTIAL_HEIGHT}
          defaultLanguage="json"
          defaultValue={props.value}
          theme={EDITOR_THEME}
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
