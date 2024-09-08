import Link from "next/link";

const HomePage = () => {
  console.log("123");
  return (
    <div>
      Home page
      <ul>
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
    </div>
  );
};

export default HomePage;
