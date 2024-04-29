import dynamic from "next/dynamic";

const CreatePage = dynamic(() => import("./CreatePage"), {
  ssr: false,
});

export default CreatePage;
