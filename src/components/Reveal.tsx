import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent } from "@mui/material";

export type RevealProps = {
  index: number;
  value: any;
};

export default function Reveal(props: RevealProps) {
  return (
    <Card elevation={6}>
      <CardHeader subheader={`Reveal Document ${props.index}`} />
      <CardContent>
        <Editor
          height="25vh"
          defaultLanguage="json"
          defaultValue={JSON.stringify(props.value, null, 2)}
          theme="vs-dark"
          options={{ lineNumbers: false }}
        />
      </CardContent>
    </Card>
  );
}
