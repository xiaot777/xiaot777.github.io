 Imagine you wrote a program on your laptop. To get it running on a server where users can use it, you need to:

  1. **Build** it — turn your source code into a runnable program.
  2. **Package** it — put all the runnable files into a neat box (a ZIP file).
  3. **Deploy** it — copy that box onto a server and start it.

A **pipeline** is a robot recipe that does all this for you, automatically, every time you push code. That's all CI/CD is — automation of the "build, package, deploy" routine.

- **CI (Continuous Integration)**: automatically builds and tests your code every time you push.
- **CD (Continuous Deployment)**: automatically deploys the result to a server.


# Pipeline YAML

## Structure

| Key                              | What it is                                                                         | Required?            |
| -------------------------------- | ---------------------------------------------------------------------------------- | -------------------- |
| `steps:` OR `jobs:` OR `stages:` | The actual work to run                                                             | Required             |
| `trigger: `                      | When the pipeline runs automatically. Without it, the pipeline only runs manually. | Strongly Recommended |
| `pool: `                         | Which machine to run on.                                                           | Strongly Recommended |
| `variables: `                    | Reusable named values                                                              | Strongly Recommended |
| `name: `                         | Custom run number format (e.g., 1.0.$(Rev:r)) to help identify builds              | Strongly Recommended |
| `pr:`                            | Trigger on pull requests                                                           | Optinal              |
| `schedules:`                     | Cron-based triggers (run nightly, etc.)                                            | Optinal              |
| `resources:`                     | Reference other repos, pipelines, containers                                       | Optinal              |
| `parameters:`                    | Runtime inputs (for manual runs or templates)                                      | Optinal              |
| `extends:`                       | Inherit from a parent template                                                     | Optinal              |
| `lockBehavior:`                  | Concurrency/locking rules                                                          | Optinal              |
| `appendCommitMessageToRunName:`  | UI cosmetics                                                                       | Optinal              |

A template - 
```
  name: 1.0.$(Date:yyyyMMdd).$(Rev:r)   # optional run name

  trigger:                                # CI trigger
    branches:
      include:
        - main

  pr:                                     # PR trigger
    branches:
      include:
        - main

  schedules:                              # nightly schedule
    - cron: "0 2 * * *"
      branches:
        include: [main]

  variables:                              # reusable values
    buildConfiguration: 'Release'

  pool:                                   # which machine
    vmImage: ubuntu-latest

  stages:                                 # the actual work
    - stage: Build
      jobs:
        - job: BuildJob
          steps:
            - script: echo "build"
    - stage: Deploy
      dependsOn: Build
      jobs:
        - deployment: DeployJob
          environment: 'prod'
          strategy:
            runOnce:
              deploy:
                steps:
                  - script: echo "deploy"
```

## `$(...)` syntax
 `$(...)` is Azure Pipelines variable syntax. It is a predefined variable that Azure DevOps automatically creates for every
pipeline run.

| Syntax           | Name                | When it's resolved                         |
| ---------------- | ------------------- | ------------------------------------------ |
| `$(varName)`     | Macro syntax        | At runtime (most common )                  |
| `${{ varName }}` | Template expression | At compile time (before the pipeline runs) |
| `$[ varName ]`   | Runtime expression  | At runtime, but evaluated differently      |

Some examples:

| Variable                          | Example Value                               | What It's For                                                  |
| --------------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| $(Build.SourcesDirectory)         | D:\a\1\s                                    | Where the code was checked out.                                |
| $(Build.ArtifactStagingDirectory) | D:\a\1\a                                    | Folder for files to be published.                              |
| $(Build.BuildId)                  | 12345                                       | Unique numeric ID for this run. Useful in log filenames, tags. |
| $(Build.BuildNumber)              | 20260519.1                                  | Human-readable run name (also used as run title in UI).        |
| $(Build.SourceBranch)             | refs/heads/main                             | Full branch ref. Used in condition: to gate by branch.         |  |
| $(Build.RequestedFor)             | Xiao Tang                                   | Who triggered the build.                                       |  |
| $(Build.Reason)                   | IndividualCI, Manual, Schedule, PullRequest | Why the build was triggered.                                   |
| $(Build.Repository.Name)          | ...                                         | Repo name.                                                     |
| $(Build.Repository.Uri)           | https://dev.azure.com/.../...               | Repo URL.                                                      |
| $(Build.BinariesDirectory)        | D:\a\1\b                                    | Conventional folder for compiled binaries.                     |
|                                   |

## an example
An example of `Build` stage: 

```
stages:
- stage: Build
  displayName: 'Build Dev'
  jobs:
  - job: BuildDev
    displayName: 'Build (Dev)'
    steps:
    - checkout: self
```

- `checkout: self` tells Azure Pipelines to clone the current repository onto the agent's filesystem so the rest of the steps have source code to work with. `self` is a keyword that refers to the repo this pipeline YAML file is stored in.
- 