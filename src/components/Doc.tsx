import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardContent, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

export type DocProps = {
  index: number;
  value: any;
  onChange: (index: number, value: any) => void;
  onIssue: (index: number) => void;
};

export default function Doc(props: DocProps) {
  const [validated, setValidated] = useState(true);

  const handleEditorValidation = (markers: {}[]) => {
    setValidated(markers.length === 0);
  };

  const handleEditorChange = (value: any, event: any) => {
    props.onChange(props.index, value);
  };

  const issue = () => validated && props.onIssue(props.index);

  return (
    <Card elevation={6}>
      <CardHeader
        title="Document"
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <>
            <IconButton
              aria-label="issue"
              onClick={issue}
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
          onChange={handleEditorChange}
          onValidate={handleEditorValidation}
        />
      </CardContent>
    </Card>
  );
}
