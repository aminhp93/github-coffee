import Link from "next/link";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Link href="/">{`Home`}</Link>
      <Link href="/check-npm-package">{`Check npm package`}</Link>
      <Link href="/table-task">{`Table Task`}</Link>
      {children}
    </>
  );
};
export { MainLayout };
