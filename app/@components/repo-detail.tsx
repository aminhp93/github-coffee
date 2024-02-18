const RepoDetail = ({ data }: any) => {
  console.log(data);
  return data ? data.description : null;
};

export default RepoDetail;
