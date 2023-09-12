import Editor from "@monaco-editor/react";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
} from "@mui/material";

import { ModeType } from "../App";

type IssuerKeyProps = {
  value: string;
  onChange: (value: string) => void;
  onValidate: (validated: boolean) => void;
  mode: ModeType;
};

export default function KeyPairs(props: IssuerKeyProps) {
  return (
    <Box sx={{ padding: 1 }}>
      <Card elevation={3}>
        <CardHeader
          title="Keypairs"
          titleTypographyProps={{ variant: "subtitle1" }}
        />
        <CardContent>
          <Editor
            height="76vh"
            defaultLanguage="json"
            value={props.value}
            theme={props.mode.monaco}
            options={{ lineNumbers: 'off', minimap: { enabled: false } }}
            onChange={(value, _) => value && props.onChange(value)}
            onValidate={(markers) => {
              props.onValidate(markers.length === 0);
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
