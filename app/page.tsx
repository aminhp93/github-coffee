"use client";

import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { MoveToInbox } from "@mui/icons-material";

const LIST_REPO = [
  {
    id: 1,
    name: "github-coffee-problem-1",
    githubUrl: "aminhp93/github-coffee-problem-1",
  },
  {
    id: 2,
    name: "github-coffee-problem-2",
    githubUrl: "aminhp93/github-coffee-problem-2",
  },
];

const Home = () => {
  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          List all problems in github-coffee
        </ListSubheader>
      }
    >
      {LIST_REPO.map((repo) => (
        <ListItemButton key={repo.id}>
          <ListItemIcon>
            <MoveToInbox />
          </ListItemIcon>
          <ListItemText primary={repo.name} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default Home;
