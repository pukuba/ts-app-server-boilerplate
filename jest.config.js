module.exports = {
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "testRegex": "\\.test\\.ts$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "json"
  ],
  "globals": {
    "ts-jest": {
      "diagnostics": true
    }
  },
  "moduleNameMapper": {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@graphql/(.*)$": "<rootDir>/src/graphql/$1",
    "^@common/(.*)$": "<rootDir>/src/common/$1",
    "^@lib$/(.*)": "<rootDir>/src/common/lib/$1"
  }
}