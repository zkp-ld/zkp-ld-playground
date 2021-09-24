import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent } from "@mui/material";
import { EDITOR_THEME } from "../App";

export type DocProps = {
  value: string;
  validated: boolean;
  onChange: (value: string) => void;
  onIssue: () => void;
  onValidate: (validated: boolean) => void;
};

export default function Doc(props: DocProps) {
  return (
    <Card elevation={3} sx={{ height: "85vh" }}>
      <CardHeader
        title="LD Document"
        titleTypographyProps={{ variant: "subtitle1" }}
      />
      <CardContent>
        <Editor
          height="80vh"
          defaultLanguage="json"
          defaultValue={props.value}
          theme={EDITOR_THEME}
          options={{ lineNumbers: false, minimap: { enabled: false } }}
          onChange={(value, _) => value && props.onChange(value)}
          onValidate={(markers) => props.onValidate(markers.length === 0)}
        />
      </CardContent>
    </Card>
  );
}
