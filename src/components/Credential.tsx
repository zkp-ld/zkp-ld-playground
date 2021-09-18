import { ChangeEvent, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export type CredentialProps = {
  index: number;
  value: any;
};

export default function Credential(props: CredentialProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Card elevation={6}>
      <CardHeader
        title="Verifiable Credential"
        titleTypographyProps={{ variant: "subtitle1" }}
        action={
          <>
            <Checkbox
              inputProps={{ "aria-label": "controlled" }}
              checked={checked}
              onChange={handleChange}
            />
            <IconButton>
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
        />
      </CardContent>
    </Card>
  );
}
