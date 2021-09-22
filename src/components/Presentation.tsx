import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent } from "@mui/material";
import { EDITOR_THEME, VerificationStatus } from "../App";
import Verify from "./Verify";

type PresentationProps = {
  vP: string;
  onVerify: () => void;
  status: VerificationStatus;
  onChange: (value: string) => void;
};

export default function Presentation(props: PresentationProps) {
  const [validated, setValidated] = useState(true);

  return (
    <Card elevation={3} sx={{ height: "85vh" }}>
      <CardHeader
        title="Verifiable Presentation"
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <Verify
            onVerify={() => props.onVerify()}
            status={validated ? props.status : "Disabled"}
          />
        }
      />
      <CardContent>
        <Editor
          height="80vh"
          defaultLanguage="json"
          value={props.vP}
          theme={EDITOR_THEME}
          options={{
            lineNumbers: false,
            minimap: { enabled: false },
          }}
          onChange={(value, _) => value && props.onChange(value)}
          onValidate={(markers) => {
            setValidated(markers.length === 0);
          }}
        />
      </CardContent>
    </Card>
  );
}
