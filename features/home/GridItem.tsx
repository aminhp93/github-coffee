import { Box } from "@mui/material";
import { styled } from "github-coffee-package/dist/theme";

type Props = {
  children: React.ReactNode;
};

const GridItem = ({ children, ...props }: Props) => {
  return (
    <Container {...props}>
      <DragHandler className="drag-handle">Drag</DragHandler>
      {children}
    </Container>
  );
};

const Container = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  // backgroundColor: theme.palette.primary.main,
  backgroundColor: "lightgray",
  // color: theme.palette.primary.contrastText,
  overflow: "hidden",
  borderRadius: "6px",
}));

const DragHandler = styled(Box)(({ theme }) => ({
  width: "100%",
  textAlign: "center",
  backgroundColor: theme.palette.secondary.main,
  ":hover": {
    cursor: "pointer",
  },
}));

export default GridItem;
