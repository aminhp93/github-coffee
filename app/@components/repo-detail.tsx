import ReactMarkdown from "react-markdown";

const RepoDetail = ({ data }: any) => {
  console.log(data);
  return <ReactMarkdown>{data}</ReactMarkdown>;
};

export default RepoDetail;
