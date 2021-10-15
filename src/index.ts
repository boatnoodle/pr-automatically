import { Probot } from "probot";

export = (app: Probot) => {
  app.on("pull_request.opened", async (context) => {
    const issueLabel = context.issue({
      labels: ["bug"],
    });
    await context.octokit.issues.addLabels(issueLabel);
  });
};
