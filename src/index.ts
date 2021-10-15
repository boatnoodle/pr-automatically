import { Probot } from "probot";

export = (app: Probot) => {
  app.on(["pull_request.opened"], async (context) => {
    const issueComment = context.issue({
      body: "This pull request is in progress.",
    });
    await context.octokit.issues.createComment(issueComment);

    const issueLabel = context.issue({
      labels: [":construction:  wip"],
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
