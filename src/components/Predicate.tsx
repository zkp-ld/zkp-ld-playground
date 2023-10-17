import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
  Stack,
  Checkbox,
  Tooltip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Editor from "@monaco-editor/react";
import {
  ModeType,
  PREDICATE_HEIGHT,
  PredicateType,
  TOOLTIP_ENTERDELAY,
} from "../App";
import { examplePredicates } from "../data";

export type PredicateProps = {
  predicate: PredicateType;
  onCheckboxChange: (index: number, checked: boolean) => void;
  onChange: (index: number, value: string) => void;
  onValidate: (index: number, validated: boolean) => void;
  onDelete: (index: number) => void;
  mode: ModeType;
};

export default function Predicate(props: PredicateProps) {
  const [value, setValue] = useState("");
  const [example, setExample] = useState("");

  const handleExampleChange = (event: SelectChangeEvent) => {
    const selectedExample = event.target.value;
    setExample(selectedExample);
    const changedValue = JSON.stringify(
      examplePredicates.get(selectedExample),
      null,
      2
    );
    setValue(changedValue);
    props.onChange(props.predicate.index, changedValue);
  };

  return (
    <>
      <Grid item xs={11}>
        <Card elevation={3}>
          <CardHeader
            title="Predicate"
            titleTypographyProps={{ variant: "subtitle1" }}
            action={
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <InputLabel id="predicate-examples-label">Examples</InputLabel>
                <Select
                  labelId="predicate-examples-label"
                  id="predicate-examples"
                  value={example}
                  label="Examples"
                  onChange={handleExampleChange}
                  autoWidth
                  style={{
                    color:
                      props.mode === "light"
                        ? "rgba(0,0,0,.85)"
                        : "rgba(255,255,255,0.85)",
                  }}
                >
                  {Array.from(examplePredicates.keys()).map((k) => (
                    <MenuItem key={k} value={k}>
                      {k}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            }
          />
          <CardContent>
            <Editor
              height={PREDICATE_HEIGHT}
              defaultLanguage="json"
              value={value}
              theme={props.mode === "light" ? "light" : "vs-dark"}
              options={{ lineNumbers: "off", minimap: { enabled: false } }}
              onChange={(changedValue, _) =>
                changedValue &&
                props.onChange(props.predicate.index, changedValue)
              }
              onValidate={(markers) =>
                props.onValidate(props.predicate.index, markers.length === 0)
              }
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={1}>
        <Stack justifyContent="center">
          <Checkbox
            inputProps={{ "aria-label": "controlled" }}
            onChange={(e) =>
              props.onCheckboxChange(props.predicate.index, e.target.checked)
            }
            checked={props.predicate.checked}
          />
          <Tooltip enterDelay={TOOLTIP_ENTERDELAY} title="delete">
            <IconButton onClick={() => props.onDelete(props.predicate.index)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Grid>
    </>
  );
}
