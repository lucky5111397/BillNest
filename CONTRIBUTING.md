# Contributing to Brightloop

Thank you for contributing to the Brightloop Subscription Management System. Please review these contribution guidelines to maintain code quality, security, and architectural consistency.

---

## 1. Principles

- **Inspect Before Modifying**: Understand existing architecture, interfaces, and patterns before introducing changes.
- **Minimal, Surgical Changes**: Solve the task cleanly without introducing unnecessary abstractions or extra dependencies.
- **Evidence-Based Engineering**: Always verify your code locally through tests, typechecking, and builds before opening a pull request.
- **Never Commit Secrets**: Never commit or print API keys, passwords, connection strings, or sensitive tokens.

---

## 2. Issues First

- All work must be associated with an open GitHub Issue.
- If an issue does not exist, open one using the appropriate issue template (`Bug Report`, `Feature Request`, or `Task`) before writing code.

---

## 3. Branching and Commits

1. Keep your local `main` up to date:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create a dedicated branch following conventions:
   ```bash
   git checkout -b feat/123-subscription-renewal
   # or
   git checkout -b fix/456-invoice-tax-rounding
   ```
3. Commit messages must adhere to [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(billing): add grace period calculation for overdue subscriptions"
   ```
4. **Never commit directly to `main`** and **never force push (`git push --force`)** to shared branches.

---

## 4. Local Development Verification

Before submitting a pull request, run all quality gates locally:

```bash
# Verify code formatting
npm run format:check

# Run linter
npm run lint

# Run TypeScript checks across all workspaces
npm run typecheck

# Run automated tests
npm run test

# Verify production builds
npm run build
```

---

## 5. Pull Request Submission

1. Push your branch to the remote repository.
2. Open a Pull Request targeting `main`.
3. Complete every section in the PR template, including manual testing evidence.
4. Verify that all automated GitHub Actions CI checks pass.
5. Address review feedback with clean follow-up commits.
