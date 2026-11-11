<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,2,24,35&height=220&section=header&text=git-grind%20⚡&fontSize=42&fontAlignY=38&desc=The%20Intelligent%20Conventional%20Commit%20CLI%20for%20Developers&descSize=18&descAlignY=62&fontColor=ffffff" width="100%" alt="git-grind" />

  <p align="center">
    <a href="https://www.npmjs.com/package/git-grind"><img src="https://img.shields.io/npm/v/git-grind?style=flat-square&color=CB3837&logo=npm" alt="npm version" /></a>
    <a href="https://github.com/shubhmangalam19-collab/git-grind/stargazers"><img src="https://img.shields.io/github/stars/shubhmangalam19-collab/git-grind?style=flat-square&color=FFD700" alt="Stars" /></a>
    <a href="https://github.com/shubhmangalam19-collab/git-grind/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License: MIT" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-43853D?style=flat-square&logo=node.js&logoColor=white" alt="Node" /></a>
    <a href="https://www.conventionalcommits.org/"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?style=flat-square&logo=git" alt="Conventional Commits" /></a>
  </p>

  <p align="center">
    <b>Stop staring at empty commit prompts. Generate clean, standardized Conventional Commits in seconds.</b><br/>
    <i>Zero-config • 100% Offline & Private • Interactive Terminal UI</i>
  </p>

</div>

---

## ⚡ Quick Start

No installation required. Run directly in any Git repository:

```bash
npx git-grind
```

Or install globally to use the shorthand `gg`:

```bash
npm install -g git-grind

# Now run anywhere:
gg
```

---

## ✨ Features

- 🧠 **Intelligent Diff Synthesis**: Analyzes modified files, directory architecture, and code changes to propose accurate Conventional Commit messages (`feat`, `fix`, `docs`, `refactor`, `test`, `ci`, `chore`).
- 🎯 **Automatic Scope Detection**: Deduces architectural scopes automatically (e.g., `feat(auth): ...`, `fix(api): ...`, `docs(readme): ...`).
- 🛡️ **100% Offline & Private**: Zero code leaves your computer. Runs entirely locally using native Node.js and Git.
- 🎨 **Modern Interactive UI**: Sleek, keyboard-navigable terminal interface powered by `@clack/prompts`.
- 🚀 **One-Shot Workflow**: Automatically stage untracked files and push to your remote branch without leaving the tool.

---

## 💻 Terminal Experience

```text
 ⚡ GIT-GRIND: CONVENTIONAL COMMIT ENGINE 

│
◇  Staged Files (3)
│   + src/auth/jwt.js
│   ~ package.json
│   ~ src/api/routes.js
│
◇  Analyzing git diff and synthesizing Conventional Commits...
│  Proposals synthesized.
│
◇  Select a commit message:
│  ● [1] feat(auth): implement initial jwt modules
│  ○ [2] fix(auth): handle error states and improve stability
│  ○ [3] chore(deps): update project dependencies and configurations
│  ○ ✏️  Edit one of the proposals...
│  ○ 💬  Write custom commit message...
│
◇  Committing changes...
│  Changes successfully committed! 🚀
│
◇  Push to remote branch (main) now?
│  Yes
│
◇  Pushing commits to origin/main...
│  Pushed to origin/main successfully! 🌐
│
└  ⚡ Keep on the #GitHubGrind! Star & streak growing.
```

---

## 🛠️ Command-Line Flags

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--all` | `-a` | Automatically stages all tracked & untracked changes (`git add -A`) |
| `--push` | `-p` | Automatically pushes to the remote branch after committing |
| `--dry-run` | `-d` | Displays the synthesized commit message without executing a commit |
| `--version` | `-v` | Displays current version |
| `--help` | `-h` | Displays the help menu |

### Power-User Examples

```bash
# Stage everything, synthesize message, commit and push in one prompt:
gg -a -p

# Test what commit message would be generated without committing:
gg --dry-run
```

---

## 📐 Conventional Commits Format

`git-grind` follows the official **[Conventional Commits Specification](https://www.conventionalcommits.org/)**:

```
<type>(<scope>): <short description>
```

- `feat`: A new feature or capability
- `fix`: A bug fix or patch
- `docs`: Documentation updates only
- `style`: Changes that do not affect the meaning of the code (formatting, linting)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `ci`: Changes to CI/CD configuration files and scripts
- `chore`: Changes to build process, tooling, or dependencies

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/shubhmangalam19-collab/git-grind/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/amazing-feature`)
3. Commit your Changes using `npx git-grind`!
4. Push to the Branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<p align="center">
  <sub>Maintained with ⚡ by <a href="https://github.com/shubhmangalam19-collab">@shubhmangalam19-collab</a> & open-source contributors</sub>
</p>
