import Editor from "@monaco-editor/react";
import { InfoOutlined } from "@mui/icons-material";
import { Card, CardHeader, CardContent, Tooltip } from "@mui/material";
import { ModeType, VerificationStatus } from "../App";
import Verify from "./Verify";

type PresentationProps = {
  vP: string;
  status: VerificationStatus;
  validated: boolean;
  onChange: (value: string) => void;
  onValidate: (validated: boolean) => void;
  onVerify: () => void;
  mode: ModeType;
};

export default function Presentation(props: PresentationProps) {
  return (
    <Card elevation={3} sx={{ height: "85vh" }}>
      <CardHeader
        title={
          <>
            Derived Proofs
            <Tooltip title="can be contained in `verifiableCredential` array of verifiable presentation">
              <InfoOutlined color="primary" />
            </Tooltip>
          </>
        }
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <Verify
            onVerify={() => props.onVerify()}
            status={
              props.validated && props.vP.trim() !== ""
                ? props.status
                : "Disabled"
            }
          />
        }
      />
      <CardContent>
        <Editor
          height="80vh"
          defaultLanguage="json"
          value={props.vP}
          theme={props.mode.monaco}
          options={{
            lineNumbers: false,
            minimap: { enabled: false },
          }}
          onChange={(value, _) => value && props.onChange(value)}
          onValidate={(markers) => {
            props.onValidate(markers.length === 0);
          }}
        />
      </CardContent>
    </Card>
  );
}
