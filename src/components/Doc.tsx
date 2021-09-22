import { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

export type DocProps = {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
  onIssue: (index: number) => void;
};

export default function Doc(props: DocProps) {
  const [validated, setValidated] = useState(true);

  return (
    <Card elevation={6} sx={{ height: "88vh" }}>
      <CardHeader
        title="LD Document"
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <Tooltip title="issue">
            <IconButton
              aria-label="issue"
              onClick={() => validated && props.onIssue(props.index)}
              disabled={!validated}
            >
              <PlayCircleIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent>
        <Editor
          height="80vh"
          defaultLanguage="json"
          defaultValue={props.value}
          theme="vs-dark"
          options={{ lineNumbers: false, minimap: { enabled: false } }}
          onChange={(value, _) => value && props.onChange(props.index, value)}
          onValidate={(markers) => setValidated(markers.length === 0)}
        />
      </CardContent>
    </Card>
  );
}
