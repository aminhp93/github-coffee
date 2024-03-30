"use client";

// Import external libraries
import { List, ListItemButton, ListItemText, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";

// Import local files
import RepoDetail from "./@components/repo-detail";
import { useRepoStore } from "./store";

const LIST_REPO = [
  {
    name: "github-coffee",
    viewCount: 100,
  },
  {
    name: "github-coffee-problem-1",
    viewCount: 200,
  },
  {
    name: "github-coffee-problem-2",
    viewCount: 300,
  },
  {
    name: "github-coffee-api",
    viewCount: 400,
  },
];

const Home = () => {
  const selectedRepo = useRepoStore((state) => state.selectedRepo);
  const setSelectedRepo = useRepoStore((state) => state.setSelectedRepo);

  const [readmeContent, setReadmeContent] = useState("");

  useEffect(() => {
    const init = async () => {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });

      // ref: https://api.github.com/repos/aminhp93/github-coffee
      const res = await octokit.request("GET /repos/{owner}/{repo}/readme", {
        owner: "aminhp93",
        repo: selectedRepo?.name || "",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      setReadmeContent(res.data.content);
    };

    init();
  }, [selectedRepo]);

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box sx={{ flex: 1, minWidth: "300px" }}>
        <List component="nav" aria-labelledby="nested-list-subheader">
          {LIST_REPO.map((repo) => (
            <ListItemButton
              selected={selectedRepo?.name === repo.name}
              key={repo.name}
              onClick={() => setSelectedRepo(repo)}
            >
              <ListItemText primary={repo.name} />
              <ListItemText
                primary={`${repo.viewCount} views`}
                sx={{
                  textAlign: "right",
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{ flex: 1 }}>
        <RepoDetail data={atob(readmeContent)} />
      </Box>
    </Box>
  );
};

export default Home;
