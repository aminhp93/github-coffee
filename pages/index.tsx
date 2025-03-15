import { Box } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Box className="text-3xl font-bold underline">Box</Box>
      <Link href="/check-npm-package">Check npm package</Link>
    </div>
  );
}
