import Fuse from "fuse.js";
import React, { useState } from "react";
import referenceList from "./referenceList.json";

import "./App.css";
import {
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

const fuse = new Fuse(referenceList, { includeScore: true, threshold: 0.5 });
const sortList = (unsortedList: string[]) => {
  return [...unsortedList]
    .filter((item) => item.length > 0)
    .sort((a, b) => {
      const resultA = fuse.search(a);
      const resultB = fuse.search(b);
      if (resultA.length === 0) {
        return 1;
      }
      if (resultB.length === 0) {
        return -1;
      }
      const posA = referenceList.indexOf(resultA[0].item);
      const posB = referenceList.indexOf(resultB[0].item);
      return posA < posB ? -1 : 1;
    });
};

const getMatch = (item: string) => {
  const match = fuse.search(item);
  if (match.length === 0) {
    return "";
  }
  return match[0].item;
};

const getScore = (item: string) => {
  const match = fuse.search(item);
  if (match.length === 0) {
    return 0;
  }
  return match[0].score;
};

function App() {
  const [groceryList, setGroceryList] = useState("");
  const [debugEnabled, setDebugEnabled] = useState(false);
  const sortedList = sortList(groceryList.split("\n")).join("\n");
  const sortedListDebug = sortedList
    .split("\n")
    .map((item) => `${item} (${getMatch(item)}, ${getScore(item)})`)
    .join("\n");
  const onGroceryListChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGroceryList(e.target.value);
  };
  const onDebugToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebugEnabled(e.target.checked);
  };
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Veckohandling-sortering
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              multiline
              onChange={onGroceryListChange}
              value={groceryList}
              rows={20}
              variant="outlined"
              fullWidth
            ></TextField>
            <FormControlLabel
              control={
                <Checkbox checked={debugEnabled} onChange={onDebugToggle} />
              }
              label="Debug mode on"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              multiline
              value={debugEnabled ? sortedListDebug : sortedList}
              rows={20}
              variant="outlined"
              disabled
              fullWidth
            ></TextField>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
