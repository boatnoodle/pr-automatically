import { Probot } from "probot";

export = (app: Probot) => {
  app.on(["pull_request.opened"], async (context) => {
    const payload = context.pullRequest({
      body: "thanks for open pull request",
    });
    await context.octokit.pulls.createReviewComment(payload);
  });

  app.on(["issues.opened"], async (context) => {
    const issueLabel = context.issue({
      body: "thanks for react",
    });
    await context.octokit.issues.createComment(issueLabel);
  });
};
