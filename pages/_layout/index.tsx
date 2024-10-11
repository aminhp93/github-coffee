import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ul
        style={{
          display: "flex",
        }}
      >
        <li>
          <Link href="/">home</Link>
        </li>
        <li>
          <Link href="/blog">blog</Link>
        </li>
        <li>
          <Link href="/stock">stock</Link>
        </li>
      </ul>
      {children}
    </>
  );
};

export default Layout;
