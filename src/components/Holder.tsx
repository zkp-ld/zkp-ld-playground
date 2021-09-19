import Editor from "@monaco-editor/react";
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  IconButton,
  Stack,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CredAndReveal from "./CredAndReveal";
import { CredAndRevealType } from "../App";

const hURIs = `[
    "http://example.org/credentials/1234",
    "http://example.org/credentials/9876",
    "http://example.org/credentials/abcd",
    "did:example:holder1",
    "did:example:cityA"
  ]`;

export type HolderProps = {
  credsAndReveals: CredAndRevealType[];
  onCheckboxChange: (index: number, checked: boolean) => void;
  onCredentialChange: (index: number, value: string) => void;
  onCredentialValidate: (index: number, validated: boolean) => void;
  onRevealChange: (index: number, value: string) => void;
  onRevealValidate: (index: number, validated: boolean) => void;
  onPresent: () => void;
};

export default function Holder(props: HolderProps) {
  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: blue[500] }} aria-label="holder">
            <PhoneAndroidIcon />
          </Avatar>
        }
        title="Holder"
        action={
          <IconButton aria-label="present" onClick={() => props.onPresent()}>
            <SendIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Stack spacing={2}>
          {props.credsAndReveals.map((credAndReveal, index) => (
            <CredAndReveal
              key={index}
              index={index}
              cred={credAndReveal.cred}
              reveal={credAndReveal.reveal}
              onCheckboxChange={(index, checked) =>
                props.onCheckboxChange(index, checked)
              }
              onCredentialChange={(index, value) =>
                props.onCredentialChange(index, value)
              }
              onCredentialValidate={(index, validated) =>
                props.onCredentialValidate(index, validated)
              }
              onRevealChange={(index, value) =>
                props.onRevealChange(index, value)
              }
              onRevealValidate={(index, validated) =>
                props.onRevealValidate(index, validated)
              }
            />
          ))}
          <Card elevation={6}>
            <CardHeader subheader="Hidden URIs" />
            <CardContent>
              <Editor
                height="10vh"
                defaultLanguage="json"
                defaultValue={hURIs}
                theme="vs-dark"
                options={{ lineNumbers: false }}
              />
            </CardContent>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  );
}
