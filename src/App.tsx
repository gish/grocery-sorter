import Fuse from "fuse.js";
import React, { useState } from "react";
import referenceList from "./referenceList.json";

import "./App.css";
import {
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import copy from "copy-to-clipboard";
import { ContentCopy } from "@mui/icons-material";

const fuse = new Fuse(referenceList, { includeScore: true, threshold: 0.5 });
interface SearchCache {
  [value: string]: Fuse.FuseResult<string>[];
}
let searchCache: SearchCache = {};
const cachedSearch = (item: string) => {
  if (searchCache[item]) {
    return searchCache[item];
  }
  const result = fuse.search(item.toLowerCase());
  searchCache[item] = result;
  return result;
};
const sortList = (unsortedList: string[]) => {
  return [...unsortedList]
    .filter((item) => item.length > 0)
    .sort((a, b) => {
      const resultA = cachedSearch(a);
      const resultB = cachedSearch(b);
      if (resultA.length === 0) {
        return 1;
      }
      if (resultB.length === 0) {
        return -1;
      }
      const posA = referenceList.indexOf(resultA[0].item as string);
      const posB = referenceList.indexOf(resultB[0].item as string);
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
  const savedList = window.localStorage.getItem("groceryList");
  const savedDebug = window.localStorage.getItem("debug") === "true";
  const [groceryList, setGroceryList] = useState(savedList ?? "");
  const [debugEnabled, setDebugEnabled] = useState(savedDebug);
  const [sortedList, setSortedList] = useState("");
  const [sortedDebugList, setSortedDebugList] = useState("");
  const onListUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    window.localStorage.setItem("groceryList", e.target.value);
    setGroceryList(e.target.value);
  };
  const onGroceryListSort = () => {
    const sortedListDebug = sortedList
      .split("\n")
      .map((item) => `${item} (${getMatch(item)}, ${getScore(item)})`)
      .join("\n");
    setSortedList(sortList(groceryList.split("\n")).join("\n"));
    setSortedDebugList(sortedListDebug);
  };
  const onDebugToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    window.localStorage.setItem("debug", e.target.checked.toString());
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
              onChange={onListUpdate}
              multiline
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
            <Button
              variant="contained"
              color="primary"
              onClick={onGroceryListSort}
            >
              Sortera
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              multiline
              value={debugEnabled ? sortedDebugList : sortedList}
              rows={20}
              variant="outlined"
              disabled
              fullWidth
            ></TextField>
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={() => copy(sortedList)}
            >
              Kopiera
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
