import Link from "next/link";
import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Button from "@mui/material/Button";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

const LIST_ITEM = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Check npm package",
    url: "/check-npm-package",
  },
  {
    title: "Table Task",
    url: "/table-task",
  },
  {
    title: "Evaluation",
    url: "/evaluation",
  },
  {
    title: "Timeline Event",
    url: "/timeline-event",
  },
];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {LIST_ITEM.map((item, index) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <Link href={item.url}>
                <ListItemText primary={item.title} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <div>
        <Button onClick={toggleDrawer(true)} startIcon={<MenuOpenIcon />} />
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </div>

      {children}
    </>
  );
};
export { MainLayout };
