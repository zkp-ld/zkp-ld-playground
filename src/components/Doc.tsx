import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

export type DocProps = {
  index: number;
  value: {} | string;
  onChange: (index: number, value: string) => void;
  onIssue: (index: number) => void;
};

export default function Doc(props: DocProps) {
  const [validated, setValidated] = useState(true);

  return (
    <Card elevation={6}>
      <CardHeader
        title="Document"
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <>
            <IconButton
              aria-label="issue"
              onClick={() => validated && props.onIssue(props.index)}
              disabled={!validated}
            >
              <SendIcon />
            </IconButton>
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </>
        }
      />
      <CardContent>
        <Editor
          height="35vh"
          defaultLanguage="json"
          defaultValue={JSON.stringify(props.value, null, 2)}
          theme="vs-dark"
          options={{ lineNumbers: false }}
          onChange={(value, _) => value && props.onChange(props.index, value)}
          onValidate={(markers) => setValidated(markers.length === 0)}
        />
      </CardContent>
    </Card>
  );
}
