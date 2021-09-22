import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

type HiddenURIsProps = {
  uris: string[];
};

export default function HiddenURIs(props: HiddenURIsProps) {
  const [checked, setChecked] = useState([] as string[]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const columns: GridColDef[] = [
    { field: "col1", headerName: "URI to be hidden", width: 400 },
  ];

  return (
    <div style={{ height: "40vh" }}>
      <DataGrid
        autoHeight
        rows={props.uris.map((uri, i) => {
          return { id: i, col1: uri };
        })}
        columns={columns}
        rowHeight={30}
        checkboxSelection
      />
    </div>
  );
}
