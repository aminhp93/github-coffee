"use client";
import { greet } from "github-coffee-package";
const TestPage = () => {
  const greetRes = greet("Test Page");
  return <div>Test Page res {greetRes}</div>;
};

export default TestPage;
