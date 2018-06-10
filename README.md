# To setup dev environment
* `nvm install 8.11.2`
* `nvm use 8.11.2 && npm install`

# To test on iPhone
* `nvm use 8.11.2 && node_modules/.bin/exp start`
* Run Expo app on iPhone, login to Expo account, and choose project

# To test in iOS simulator
- Run in another tab: `nvm use 8.11.2 && node_modules/.bin/exp start`
- `nvm use 8.11.2 && node_modules/.bin/exp ios`

# To run eslint
`nvm use 8.11.2 && node_modules/.bin/eslint App.js __tests__ api components constants navigation screens`

# To run static type checking
`nvm use 8.11.2 && node_modules/.bin/flow`

# To run automated tests
`nvm use 8.11.2 && node_modules/.bin/jest`
