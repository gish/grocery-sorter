import Fuse from "fuse.js";
import React, { useState } from "react";
import referenceList from "./referenceList.json";

import "./App.css";
import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import copy from "copy-to-clipboard";
import { Clear, ContentCopy } from "@mui/icons-material";
import { Stack } from "@mui/system";

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

function App() {
  const savedList = window.localStorage.getItem("groceryList");
  const [groceryList, setGroceryList] = useState(savedList ?? "");
  const onListUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    window.localStorage.setItem("groceryList", e.target.value);
    setGroceryList(e.target.value);
  };
  const onGroceryListSort = () => {
    const sortedList = sortList(groceryList.split("\n")).join("\n");
    window.localStorage.setItem("groceryList", sortedList);
    setGroceryList(sortedList);
  };
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Veckohandling-sortering
        </Typography>
        <TextField
          margin="normal"
          onChange={onListUpdate}
          multiline
          value={groceryList}
          rows={20}
          variant="outlined"
          fullWidth
        ></TextField>
        <Stack spacing={1} direction="row">
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={() => setGroceryList("")}
          >
            Rensa
          </Button>
          <Button
            variant="outlined"
            startIcon={<ContentCopy />}
            onClick={() => copy(groceryList)}
          >
            Kopiera
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onGroceryListSort}
          >
            Sortera
          </Button>
        </Stack>
      </Container>
    </>
  );
}

export default App;
