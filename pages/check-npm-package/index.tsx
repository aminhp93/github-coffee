import dynamic from "next/dynamic";

const CheckNpmPackage = dynamic(() => import("@/features/check-npm-package"), {
  ssr: false,
});

export default function CheckNpmPackagePage() {
  return <CheckNpmPackage />;
}
