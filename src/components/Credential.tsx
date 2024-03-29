import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent } from "@mui/material";
import { CREDENTIAL_HEIGHT, ModeType, VerificationStatus } from "../App";
import Verify from "./Verify";

export type CredentialProps = {
  index: number;
  value: string;
  status: VerificationStatus;
  validated: boolean;
  didDocumentsValidated: boolean;
  onChange: (index: number, value: string) => void;
  onValidate: (index: number, validated: boolean) => void;
  onVerify: (index: number) => void;
  mode: ModeType;
};

export default function Credential(props: CredentialProps) {
  return (
    <Card elevation={3}>
      <CardHeader
        title={`Verifiable Credential ${props.index + 1}`}
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <Verify
            onVerify={() => props.onVerify(props.index)}
            status={
              props.validated &&
              props.value.trim() !== "" &&
              props.didDocumentsValidated
                ? props.status
                : "Disabled"
            }
          />
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
