import {
  createLambdaFunction,
  createProbot,
} from "@probot/adapter-aws-lambda-serverless";
import appFn from "../../src";

const handler = createLambdaFunction(appFn, {
  probot: createProbot(),
});

export { handler };
