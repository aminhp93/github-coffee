"use client";

import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";

import { MoveToInbox } from "@mui/icons-material";
import RepoDetail from "./@components/repo-detail";
import GithubCoffeeProblem1 from "@/content/github-coffee-problem-1.mdx";
import GithubCoffeeProblem2 from "@/content/github-coffee-problem-2.mdx";
import GithubCoffeeApi from "@/content/github-coffee-api.mdx";
import { useRepoStore } from "./store";

const LIST_REPO = [
  {
    id: 1,
    name: "github-coffee-problem-1",
    githubUrl: "aminhp93/github-coffee-problem-1",
    description: <GithubCoffeeProblem1 />,
  },
  {
    id: 2,
    name: "github-coffee-problem-2",
    githubUrl: "aminhp93/github-coffee-problem-2",
    description: <GithubCoffeeProblem2 />,
  },
  {
    id: 3,
    name: "github-coffee-api",
    githubUrl: "aminhp93/github-coffee-api",
    description: <GithubCoffeeApi />,
  },
];

const Home = () => {
  const selectedRepo = useRepoStore((state) => state.selectedRepo);
  const setSelectedRepo = useRepoStore((state) => state.setSelectedRepo);

  console.log(
    selectedRepo,
    LIST_REPO.find((i) => i.githubUrl === selectedRepo?.githubUrl)
  );

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <List component="nav" aria-labelledby="nested-list-subheader">
          {LIST_REPO.map((repo) => (
            <ListItemButton key={repo.id} onClick={() => setSelectedRepo(repo)}>
              <ListItemText primary={repo.name} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{ flex: 1 }}>
        <RepoDetail
          data={LIST_REPO.find((i) => i.githubUrl === selectedRepo?.githubUrl)}
        />
      </Box>
    </Box>
  );
};

export default Home;
