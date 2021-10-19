import { Probot } from "probot";

export = (app: Probot) => {
  app.on(["pull_request"], async (context) => {
    const action = context.payload.action;
    const isDraftPR = context.payload.pull_request.draft;

    if (action === "opened") {
      if (isDraftPR) {
        const issueComment = context.issue({
          body: "This pull request is in progress.",
        });
        await context.octokit.issues.createComment(issueComment);

        const issueLabel = context.issue({
          labels: [":construction:  wip"],
        });
        await context.octokit.issues.addLabels(issueLabel);
      } else
        await context.octokit.issues.addLabels(
          context.issue({
            labels: [":mag:  unreviewed"],
          })
        );
    } else if (action === "ready_for_review") {
      const targetDeleteLabel = await context.octokit.issues
        .listLabelsOnIssue(context.issue())
        .then((response) => response?.data?.[0]?.name);

      if (targetDeleteLabel)
        await context.octokit.issues.deleteLabel(
          context.issue({
            name: targetDeleteLabel,
          })
        );
      await context.octokit.issues.addLabels(
        context.issue({
          labels: [":mag:  unreviewed"],
        })
      );
    } else if (action === "review_requested") {
      const targetDeleteLabel = await context.octokit.issues
        .listLabelsOnIssue(context.issue())
        .then((response) => response?.data?.[0]?.name);

      if (targetDeleteLabel)
        await context.octokit.issues.deleteLabel(
          context.issue({
            name: targetDeleteLabel,
          })
        );
      await context.octokit.issues.addLabels(
        context.issue({
          labels: [":mag:  review_requested"],
        })
      );
    }
  });

  app.on(["pull_request_review"], async (context) => {
    const action = context.payload.action;
    const reviewState = context.payload.review.state;

    if (action === "submitted") {
      if (reviewState === "changes_requested") {
        try {
          await context.octokit.issues.getLabel(
            context.issue({
              name: ":ambulance:  changes_requested",
            })
          );
        } catch (error: any) {
          if (error?.status === 404) {
            const targetDeleteLabel = await context.octokit.issues
              .listLabelsOnIssue(context.issue())
              .then((response) => response?.data?.[0]?.name);

            if (targetDeleteLabel)
              await context.octokit.issues.deleteLabel(
                context.issue({
                  name: targetDeleteLabel,
                })
              );
            await context.octokit.issues.addLabels(
              context.issue({
                labels: [":ambulance:   changes_requested"],
              })
            );
          }
        }
      } else if (reviewState === "approved") {
        const response = await context.octokit.pulls.listReviews(
          context.pullRequest()
        );
        const amountApproval = response?.data?.filter(
          (each) => each?.state === "APPROVED"
        )?.length;

        const targetDeleteLabel = await context.octokit.issues
          .listLabelsOnIssue(context.issue())
          .then((response) => response?.data?.[0]?.name);
        if (targetDeleteLabel)
          await context.octokit.issues.deleteLabel(
            context.issue({
              name: targetDeleteLabel,
            })
          );
        if (amountApproval < 2) {
          await context.octokit.issues.addLabels(
            context.issue({
              labels: [":white_check_mark:   partially_approved"],
            })
          );
        }
        //todo:: it has some edge cases when they approved and then change to another it might be more than 2 approved.
        else if (amountApproval >= 2) {
          await context.octokit.issues.addLabels(
            context.issue({
              labels: [":white_check_mark:   approved"],
            })
          );
        }
      }
    }
  });

  //todo: if it has comment on code should change_requested as well ?
  // app.on(["pull_request_review_comment"], async (context) => {
  //   console.log(context, " context");
  // });
};
