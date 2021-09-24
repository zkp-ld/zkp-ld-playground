import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Badge,
  CardActionArea,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CredAndReveal from "./CredAndReveal";
import { CredAndRevealType } from "../App";
import HiddenURIs from "./HiddenURIs";

export type HolderProps = {
  credsAndReveals: CredAndRevealType[];
  hiddenURIs: string[];
  onCheckboxChange: (index: number, checked: boolean) => void;
  onCredentialChange: (index: number, value: string) => void;
  onCredentialValidate: (index: number, validated: boolean) => void;
  onRevealChange: (index: number, value: string) => void;
  onRevealValidate: (index: number, validated: boolean) => void;
  onVerify: (index: number) => void;
  onPresent: () => void;
  onClick: () => void;
  onSelectedHiddenURIsChange: (selected: string[]) => void;
  onDeleteCredAndReveal: (index: number) => void;
};

export default function Holder(props: HolderProps) {
  return (
    <Card variant="outlined" sx={{ height: "95vh", overflow: "auto" }}>
      <CardActionArea onClick={(_: any) => props.onClick()}>
        <CardHeader
          avatar={
            <Badge badgeContent={4} color="primary">
              <Avatar sx={{ bgcolor: blue[500] }} aria-label="holder">
                <PhoneAndroidIcon />
              </Avatar>
            </Badge>
          }
          title="Holder"
          action={
            <Tooltip title="present">
              <IconButton
                aria-label="present"
                onClick={() => props.onPresent()}
              >
                <PlayCircleIcon />
              </IconButton>
            </Tooltip>
          }
        />
      </CardActionArea>
      <CardContent>
        <Stack spacing={2}>
          {props.credsAndReveals
            .filter((cr) => cr)
            .map((credAndReveal) => (
              <CredAndReveal
                key={credAndReveal.index}
                index={credAndReveal.index}
                credAndReveal={credAndReveal}
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
                onVerify={(index) => props.onVerify(index)}
                onDelete={(index) => props.onDeleteCredAndReveal(index)}
              />
            ))}
          <HiddenURIs
            vCs={props.credsAndReveals
              .filter((cr) => cr)
              .map((credAndReveal) => credAndReveal.cred)}
            onSelectedHiddenURIsChange={(selected) =>
              props.onSelectedHiddenURIsChange(selected)
            }
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
