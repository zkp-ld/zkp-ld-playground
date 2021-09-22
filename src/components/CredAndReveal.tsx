import {
  Card,
  Checkbox,
  Grid,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Credential from "./Credential";
import Reveal from "./Reveal";

export type CredAndRevealProps = {
  index: number;
  cred: string;
  reveal: string;
  onCheckboxChange: (index: number, checked: boolean) => void;
  onCredentialChange: (index: number, value: string) => void;
  onCredentialValidate: (index: number, validated: boolean) => void;
  onRevealChange: (index: number, value: string) => void;
  onRevealValidate: (index: number, validated: boolean) => void;
};

export default function CredAndReveal(props: CredAndRevealProps) {
  return (
    <>
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
            <Tooltip title="check to be presented">
              <Checkbox
                inputProps={{ "aria-label": "controlled" }}
                onChange={(e) =>
                  props.onCheckboxChange(props.index, e.target.checked)
                }
              />
            </Tooltip>
            <Tooltip title="delete">
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
