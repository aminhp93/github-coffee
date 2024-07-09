"use client";

import { ReactNode } from "react";
import { Button, AppBar, Box, Toolbar } from "@mui/material";
import { useRouter } from "next/navigation";

import { LIST_ALL_ROUTE, STATUS } from "./constants";

function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          {LIST_ALL_ROUTE.filter((i) => i.status === STATUS.WORKING).map(
            (item) => (
              <Button
                startIcon={<item.icon />}
                key={item.key}
                sx={{ mr: 2 }}
                onClick={() => router.push(item.url)}
              >
                {item.key}
              </Button>
            )
          )}

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {LIST_ALL_ROUTE.filter((i) => i.status === STATUS.DONE).map(
              (item) => (
                <Button
                  startIcon={<item.icon />}
                  key={item.key}
                  sx={{ mr: 2 }}
                  onClick={() => router.push(item.url)}
                >
                  {item.key}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
}

export { Layout };
