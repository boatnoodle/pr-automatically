import { Probot } from "probot";

export = (app: Probot) => {
  app.on(["pull_request.opened"], async (context) => {
    const issueComment = context.issue({
      body: "thanks for open pr",
    });
    await context.octokit.issues.createComment(issueComment);

    const issueLabel = context.issue({
      labels: ["bug"],
    });
    await context.octokit.issues.addLabels(issueLabel);
  });

  app.on(["issues.opened"], async (context) => {
    const issueLabel = context.issue({
      body: "thanks for react",
    });
    await context.octokit.issues.createComment(issueLabel);
  });
};
