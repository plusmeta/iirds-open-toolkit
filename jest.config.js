module.exports = {
    moduleFileExtensions: [
        "js",
        "jsx",
        "json",
        // tell Jest to handle *.vue files
        "vue"
    ],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{js,jsx,vue}"],
    coverageReporters: ["clover", "text-summary"],
    testResultsProcessor: "jest-junit",
    transform: {
        // process *.vue files with vue-jest
        "^.+\\.vue$": require.resolve("vue-jest"),
        ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
            require.resolve("jest-transform-stub"),
        "^.+\\.jsx?$": require.resolve("babel-jest")
    },
    transformIgnorePatterns: ["/node_modules/"],
    // support the same @ -> src alias mapping in source code
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^#/(.*)$": "<rootDir>/tests/$1"
    },
    testEnvironment: "jest-environment-jsdom-fifteen",
    // serializer for snapshots
    snapshotSerializers: [
        "jest-serializer-vue"
    ],
    testMatch: [
        "**/tests/unit/**/*.spec.[jt]s?(x)",
        "**/__tests__/*.[jt]s?(x)"
    ],
    testURL: "http://localhost/",
    watchPlugins: [
        require.resolve("jest-watch-typeahead/filename"),
        require.resolve("jest-watch-typeahead/testname")
    ]
};
