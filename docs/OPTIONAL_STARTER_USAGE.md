# Using the Optional Starter

The reusable Agent Skills and the opinionated web starter are independent.

Install skills without adopting the starter:

```bash
bash install.sh
```

Prepare an existing repository without creating a new application:

```bash
./setup-project.sh /path/to/project
```

Explicitly opt into the personal web starter:

```bash
./create-web-app.sh ../my-app
```

Add optional feature packs only when needed:

```bash
./create-web-app.sh ../my-app --src-dir --shadcn --motion --forms
```

Preview without creating anything:

```bash
./create-web-app.sh ../my-app --dry-run
```

Installing the skills alone never invokes the starter and never changes a project's technology choices.
