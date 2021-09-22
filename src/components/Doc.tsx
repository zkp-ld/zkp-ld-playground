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
import { EDITOR_THEME } from "../App";

export type DocProps = {
  value: string;
  onChange: (value: string) => void;
  onIssue: () => void;
};

export default function Doc(props: DocProps) {
  const [validated, setValidated] = useState(true);

  return (
    <Card elevation={3} sx={{ height: "85vh" }}>
      <CardHeader
        title="LD Document"
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <Tooltip title="issue">
            <IconButton
              aria-label="issue"
              onClick={() => validated && props.onIssue()}
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
          theme={EDITOR_THEME}
          options={{ lineNumbers: false, minimap: { enabled: false } }}
          onChange={(value, _) => value && props.onChange(value)}
          onValidate={(markers) => setValidated(markers.length === 0)}
        />
      </CardContent>
    </Card>
  );
}
