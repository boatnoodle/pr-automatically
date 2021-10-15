import { Probot } from "probot";

export = (app: Probot) => {
  app.on(["issues.opened", "pull_request.opened"], async (context) => {
    const issueLabel = context.issue({
      body: "thanks for react",
    });
    await context.octokit.issues.createComment(issueLabel);
  });
};
