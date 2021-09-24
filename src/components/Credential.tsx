import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent } from "@mui/material";
import { useState } from "react";
import { CREDENTIAL_HEIGHT, EDITOR_THEME, VerificationStatus } from "../App";
import Verify from "./Verify";

export type CredentialProps = {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
  onValidate: (index: number, validated: boolean) => void;
  onVerify: (index: number) => void;
  status: VerificationStatus;
};

export default function Credential(props: CredentialProps) {
  const [validated, setValidated] = useState(true);

  return (
    <Card elevation={3}>
      <CardHeader
        title={`Verifiable Credential ${props.index + 1}`}
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <Verify
            onVerify={() => props.onVerify(props.index)}
            status={
              validated && props.value.trim() !== "" ? props.status : "Disabled"
            }
          />
        }
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
