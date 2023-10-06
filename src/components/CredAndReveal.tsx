import { Checkbox, Grid, IconButton, Stack, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Credential from "./Credential";
import Reveal from "./Reveal";
import { CredAndRevealType, ModeType, TOOLTIP_ENTERDELAY } from "../App";

export type CredAndRevealProps = {
  index: number;
  credAndReveal: CredAndRevealType;
  didDocumentsValidated: boolean;
  onCheckboxChange: (index: number, checked: boolean) => void;
  onCredentialChange: (index: number, value: string) => void;
  onCredentialValidate: (index: number, validated: boolean) => void;
  onRevealChange: (index: number, value: string) => void;
  onRevealValidate: (index: number, validated: boolean) => void;
  onVerify: (index: number) => void;
  onDelete: (index: number) => void;
  mode: ModeType;
};

export default function CredAndReveal(props: CredAndRevealProps) {
  return (
    <>
      <Grid item xs={6}>
        <Credential
          index={props.index}
          value={props.credAndReveal.cred}
          didDocumentsValidated={props.didDocumentsValidated}
          onChange={(index, value) => props.onCredentialChange(index, value)}
          onValidate={(index, validated) =>
            props.onCredentialValidate(index, validated)
          }
          onVerify={(index) => props.onVerify(index)}
          status={props.credAndReveal.credStatus}
          validated={props.credAndReveal.credValidated}
          mode={props.mode}
        />
      </Grid>
      <Grid item xs={5}>
        <Reveal
          index={props.index}
          value={props.credAndReveal.reveal}
          onChange={(index, value) => props.onRevealChange(index, value)}
          onValidate={(index, validated) =>
            props.onRevealValidate(index, validated)
          }
          mode={props.mode}
        />
      </Grid>
      <Grid item xs={1}>
        <Stack justifyContent="center">
          <Checkbox
            inputProps={{ "aria-label": "controlled" }}
            onChange={(e) =>
              props.onCheckboxChange(props.index, e.target.checked)
            }
            checked={props.credAndReveal.checked}
          />
          <Tooltip enterDelay={TOOLTIP_ENTERDELAY} title="delete">
            <IconButton onClick={() => props.onDelete(props.index)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Grid>
    </>
  );
}
