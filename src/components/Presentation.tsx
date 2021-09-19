import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent } from "@mui/material";
import Verify from "./Verify";

type PresentationProps = {
  vP: {};
};

export default function Presentation(props: PresentationProps) {
  return (
    <Card elevation={6}>
      <CardHeader
        title="Verifiable Presentation"
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <Verify
            index={0}
            onVerify={(index) => console.log("verify called")}
          />
        }
      />
      <CardContent>
        <Editor
          height="80vh"
          defaultLanguage="json"
          value={JSON.stringify(props.vP, null, 2)}
          theme="vs-dark"
          options={{ lineNumbers: false }}
        />
      </CardContent>
    </Card>
  );
}
