# GitHub Workflow and Engineering Standards

## 1. Branching Strategy

Brightloop uses a trunk-based development strategy with short-lived feature branches:

- **Integration Branch**: `main` is the primary protected branch.
- **Direct Commits**: Direct commits to `main` are strictly forbidden.
- **Feature Branches**: All changes must originate from dedicated branches cut from the latest `main`.

### Branch Naming Conventions:

- `feat/<issue-id>-<short-description>`: New functional capabilities
- `fix/<issue-id>-<short-description>`: Bug fixes
- `chore/<short-description>`: Foundation, tooling, dependencies, or maintenance
- `docs/<short-description>`: Documentation additions or updates
- `refactor/<short-description>`: Code restructuring without behavior changes
- `test/<short-description>`: Adding or improving automated tests

---

## 2. Commit Message Conventions

Commits must follow the **Conventional Commits** specification:

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Allowed Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (whitespace, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Tooling, build process, or auxiliary tool changes

---

## 3. Pull Request Process

1. **Link to Issue**: Every PR must reference an existing GitHub issue (`Closes #<id>` or `Fixes #<id>`).
2. **Fill PR Template**: Complete all sections of `.github/PULL_REQUEST_TEMPLATE.md`.
3. **Automated CI Validation**: All checks in `.github/workflows/ci.yml` must pass:
   - `npm run format:check`
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
4. **Code Review**: At least one peer review approval is required before merge.
5. **No Force Pushes**: Do not rewrite shared git history.
