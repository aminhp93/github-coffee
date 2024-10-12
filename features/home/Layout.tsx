import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { ReactNode } from "react";
import { useTranslation } from "github-coffee-package/dist/utils/translation";
import { styled } from "github-coffee-package/dist/theme";

const dummyDashboards = [
  {
    uuid: "1",
    name: "Dashboard 1",
  },
  {
    uuid: "2",
    name: "Dashboard 2",
  },
  {
    uuid: "2",
    name: "Dashboard 2",
  },
  {
    uuid: "2",
    name: "Dashboard 2",
  },
];

export const TopBar = () => {
  const { t } = useTranslation();
  const dashboards = dummyDashboards;

  return (
    <TopBarBox>
      <GroupFlex>
        {dashboards ? (
          <>
            <FormControl>
              <InputLabel>{t("dashboard")}</InputLabel>
              <Select size="small" label={t("dashboard")} value={"1"}>
                {dashboards.map((dashboard) => (
                  <MenuItem key={dashboard.uuid} value={dashboard.uuid}>
                    {dashboard.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton>Edit</IconButton>
          </>
        ) : (
          <Select size="small" label={t("dashboard")} disabled value={"0"}>
            <MenuItem value={"0"}>{t("noDashboard")}</MenuItem>
          </Select>
        )}
      </GroupFlex>
      <GroupFlex>
        <Button variant="outlined">{t("dashboard")}</Button>
        <Button variant="contained">{t("widget")}</Button>
      </GroupFlex>
    </TopBarBox>
  );
};

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <LayoutBox>
      {/* <TopBar /> */}
      <div>What do you want to see daily?</div>
      {children}
    </LayoutBox>
  );
};

const LayoutBox = styled(Box)(() => ({
  height: "100%",
}));

const TopBarBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  background: theme.palette.background.paper,
  padding: theme.spacing(4),
}));

const GroupFlex = styled(Box)(() => ({
  display: "flex",
  gap: "10px",
}));
