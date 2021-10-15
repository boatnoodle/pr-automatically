import { Probot } from "probot";

export = (app: Probot) => {
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  app.on("pull_request.opened", async (context) => {
    const issueLabel = context.issue({
      labels: [":construction:  wip"],
    });
    await context.octokit.issues.addLabels(issueLabel);
  });
};
