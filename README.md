# Usage
## Install dependancies 🔧
```npm i```
## Run tests 🧪
Replace browser with either chromium, firefox, or webkit
You can't run in all 3 at the same time because the user account is a free account so can only have a certain number of folders and labels on the account at once.

```npm run test:<browser>```

Tests are also automatically run with each push to master/main or PR to master/main. You can view the results via the Actions tab on Github and download the report.

## Manually generate report 📚
```npm run report```

# Findings 🔎
- The modal for adding a new label is littered with folder identifiers which is bad for accessability
- When you create/edit/delete a folder it calls a labels endpoint instead of a folders endpoint

# Improvements 🎯
## Setup/tearDown
- See if I could inject the test folders and labels directly into the page without using the UI in the before each
- Make api calls to setup and tearDown folders and labels

## Parallel
- Get an account without folder and label limits and then add a timestamp to each name to make them unique, this will allow the tests to be run in parallel

## General
- Overload my edit commands that have optional paramters
- Use dotenv for the username and password