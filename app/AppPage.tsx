"use client";

// Import external libraries
import { List, ListItemButton, ListItemText, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";

// Import local files
import { useRepoStore } from "./store";
import { LIST_REPO } from "./constants";
import { BlockNoteView } from "@blocknote/react";
import RepoDetail from "./RepoDetail";

const Home = () => {
  const selectedRepo = useRepoStore((state) => state.selectedRepo);
  const setSelectedRepo = useRepoStore((state) => state.setSelectedRepo);
  const [readmeContent, setReadmeContent] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        if (!selectedRepo) return;

        const octokit = new Octokit({
          auth: process.env.GITHUB_TOKEN,
        });

        // ref: https://api.github.com/repos/aminhp93/github-coffee
        const res = await octokit.request("GET /repos/{owner}/{repo}/readme", {
          owner: "aminhp93",
          repo: selectedRepo.name || "",
          headers: {
            // "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github.VERSION.raw",
          },
        });

        console.log(res);

        setReadmeContent(res.data as any);
      } catch (e) {
        setReadmeContent("");
      }
    };

    init();
  }, [selectedRepo]);

  return (
    <Box sx={{ display: "flex" }}>
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
      <Box>
        <RepoDetail initialMarkdown={readmeContent} />
      </Box>
    </Box>
  );
};

export default Home;
