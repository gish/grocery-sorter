import Fuse from "fuse.js";
import React, { useState } from "react";
import referenceList from "./referenceList.json";

import "./App.css";
import {
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

const fuse = new Fuse(referenceList, { includeScore: true, threshold: 0.3 });
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

function App() {
  const [groceryList, setGroceryList] = useState("");
  const sortedList = sortList(groceryList.split("\n")).join("\n");
  const onGroceryListChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGroceryList(e.target.value);
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
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              multiline
              value={sortedList}
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
