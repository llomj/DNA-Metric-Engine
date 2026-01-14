# GitHub Pages Deployment Instructions

## Step 1: Enable GitHub Pages

**You MUST do this manually in GitHub:**

1. Go to your repository: https://github.com/llomj/DNA-Metric-Engine
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select: **GitHub Actions**
5. Click **Save** (if you don't see Save, make sure you're signed in and have admin access)

## Step 2: Wait for Workflow to Complete

Once GitHub Pages is enabled:
- The workflow will automatically run on every push to `main`
- Check the status at: https://github.com/llomj/DNA-Metric-Engine/actions
- Wait 2-3 minutes for the workflow to complete

## Step 3: Access Your PWA

Once the workflow shows green (success):
- Your PWA will be live at: **https://llomj.github.io/DNA-Metric-Engine/**

## Troubleshooting

**If workflows are still red after enabling Pages:**
- Make sure you clicked "Save" in the Pages settings
- Wait a few minutes for GitHub to process the change
- Check the workflow logs for specific errors

**If you don't see a "Save" button:**
- Make sure you're signed in to GitHub
- Make sure you have admin/write access to the repository
- Try refreshing the page
