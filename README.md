# Commerce-Factory app

<img width="1470" height="956" alt="Screenshot 2026-04-11 at 23 05 30" src="https://github.com/user-attachments/assets/f29909f1-8fc0-4231-a236-749f3bfc015f" />

This is a e-commerce factory app. The dev branch is the branch containing all the common skeleton template for an ecommerce website. After that you can create your own branch for specific e-commerce website you want to create

### This app uses the [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## 🚀 Getting Started

Follow these steps to set up the project locally:

```bash
# 1. Fork the repository (via GitHub UI)

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/REPO-NAME.git

# 3. Navigate into the project
cd REPO-NAME

# 4. Install dependencies
pnpm install

# 5. Start development server
pnpm dev
```

---

## 🌿 Branching Strategy

```bash
# Create a new feature branch from main (or dev if applicable)
git checkout -b feat/your-feature-name

# Example:
git checkout -b feat/create-login
```

---

## 💾 Working with Changes

```bash
# Stage changes
git add .

# Commit changes
git commit -m "feat: add login functionality"

# Push branch to your fork
git push origin feat/your-feature-name
```

---

## 🔁 Keeping Your Fork Updated

```bash
# Add upstream remote (only once)
git remote add upstream https://github.com/ORIGINAL-OWNER/REPO-NAME.git

# Fetch latest changes
git fetch upstream

# Merge updates into your local main
git checkout main
git merge upstream/main

# Push updated main to your fork
git push origin main
```

---

## 📬 Creating a Pull Request

1. Go to your fork on GitHub
2. Click **"Compare & pull request"**
3. Add a clear title and description
4. Submit the PR 🚀

---

## 🧪 Optional Commands

```bash
# Run linting
pnpm lint

# Run tests
pnpm test

# Build project
pnpm build
```

