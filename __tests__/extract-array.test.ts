import { extractArray } from "../src/utils/chain";
import { JSONString } from "../src/types/common";

describe("Strings should be extracted from arrays correctly", () => {
  const modelResult: JSONString = `
[
  "Research and implement natural language processing techniques to improve task creation accuracy.",
  "Develop a machine learning model to predict the most relevant tasks for users based on their past activity.",
  "Integrate with external tools and services to provide users with additional features such as task prioritization and scheduling."
]
`;

  it("simple", () => {
    const extractedArray = extractArray(modelResult);
    expect(extractedArray.length).toBe(3);
    expect(extractedArray[2]).toBe(
      "Integrate with external tools and services to provide users with additional features such as task prioritization and scheduling."
    );
  });
});
