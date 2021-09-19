import { Card, Checkbox, Grid, IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Credential from "./Credential";
import Reveal from "./Reveal";

export type CredAndRevealProps = {
  index: number;
  cred: any;
  reveal: any;
  onCheckboxChange: (index: number, checked: boolean) => void;
  onCredentialChange: (index: number, value: string) => void;
  onCredentialValidate: (index: number, validated: boolean) => void;
  onRevealChange: (index: number, value: string) => void;
  onRevealValidate: (index: number, validated: boolean) => void;
};

export default function CredAndReveal(props: CredAndRevealProps) {
  return (
    <Card>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Credential
            index={props.index}
            value={props.cred}
            onChange={(index, value) => props.onCredentialChange(index, value)}
            onValidate={(index, validated) =>
              props.onCredentialValidate(index, validated)
            }
          />
        </Grid>
        <Grid item xs={5}>
          <Reveal
            index={props.index}
            value={props.reveal}
            onChange={(index, value) => props.onRevealChange(index, value)}
            onValidate={(index, validated) =>
              props.onRevealValidate(index, validated)
            }
          />
        </Grid>
        <Grid item xs={1}>
          <Stack justifyContent="center">
            <Checkbox
              inputProps={{ "aria-label": "controlled" }}
              onChange={(e) =>
                props.onCheckboxChange(props.index, e.target.checked)
              }
            />
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
