import FeatureEvaluation from "./FeatureEvaluation";
import PackageEvaluation from "./PackageEvaluation";
import ProjectEvaluation from "./ProjectEvaluation";

const Evaluation = () => {
  return (
    <div>
      <h1>Evaluation</h1>
      <p>This is the evaluation page.</p>
      <FeatureEvaluation />
      <PackageEvaluation />
      <ProjectEvaluation />
    </div>
  );
};

export default Evaluation;
