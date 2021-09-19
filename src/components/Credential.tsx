import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent } from "@mui/material";

export type CredentialProps = {
  index: number;
  value: {} | string;
  onChange: (index: number, value: string) => void;
  onValidate: (index: number, validated: boolean) => void;
};

export default function Credential(props: CredentialProps) {
  return (
    <Card elevation={6}>
      <CardHeader
        title={`Verifiable Credential ${props.index + 1}`}
        titleTypographyProps={{ variant: "subtitle1" }}
      />
      <CardContent>
        <Editor
          height="35vh"
          defaultLanguage="json"
          defaultValue={JSON.stringify(props.value, null, 2)}
          theme="vs-dark"
          options={{ lineNumbers: false }}
          onChange={(value, _) => value && props.onChange(props.index, value)}
          onValidate={(markers) =>
            props.onValidate(props.index, markers.length === 0)
          }
        />
      </CardContent>
    </Card>
  );
}
