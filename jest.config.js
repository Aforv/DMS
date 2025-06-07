module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!axios|flowbite-react)/"
  ]
};
