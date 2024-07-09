"use client";

import { ReactNode } from "react";
import { Button, AppBar, Box, Toolbar, IconButton } from "@mui/material";
import { Home, FormatListBulleted, BugReport } from "@mui/icons-material";
// import router
import { useRouter } from "next/navigation";

export default function PrimarySearchAppBar({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => router.push("/")}
          >
            <Home />
          </IconButton>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => router.push("/list-repos")}
          >
            <FormatListBulleted />
          </IconButton>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => router.push("/test")}
          >
            <BugReport />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button onClick={() => router.push("/blog")} color="inherit">
              Blog
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
}
