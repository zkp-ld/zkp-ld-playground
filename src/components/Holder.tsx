import Editor from "@monaco-editor/react";
import {
  Grid,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  IconButton,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import Credential from "./Credential";
import Reveal from "./Reveal";
import { CredAndReveal } from "../App";
import { Fragment } from "react";

const hURIs = `[
    "http://example.org/credentials/1234",
    "http://example.org/credentials/9876",
    "http://example.org/credentials/abcd",
    "did:example:holder1",
    "did:example:cityA"
  ]`;

export type HolderProps = {
  credsAndReveals: CredAndReveal[];
};

export default function Holder(props: HolderProps) {
  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: blue[500] }} aria-label="holder">
            H
          </Avatar>
        }
        title="Holder"
        action={
          <IconButton aria-label="present">
            <SendIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          {props.credsAndReveals.map((credAndReveal, index) => (
            <Fragment key={index}>
              <Grid item xs={6}>
                <Credential index={index} value={credAndReveal.cred} />
              </Grid>
              <Grid item xs={6}>
                <Reveal index={index} value={credAndReveal.reveal} />
              </Grid>
            </Fragment>
          ))}
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
