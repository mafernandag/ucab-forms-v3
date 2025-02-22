const plugins = [
  [
    "babel-plugin-import",
    {
      libraryName: "@mui/material",
      libraryDirectory: "",
      camel2DashComponentName: false,
    },
    "core",
  ],
  [
    "babel-plugin-import",
    {
      libraryName: "@mui/icons-material",
      libraryDirectory: "",
      camel2DashComponentName: false,
    },
    "icons",
  ],
  [
    "babel-plugin-import",
    {
      libraryName: "@mui/lab",
      libraryDirectory: "",
      camel2DashComponentName: false,
    },
    "lab",
  ],
  [
    "babel-plugin-import",
    {
      libraryName: "lodash",
      libraryDirectory: "",
      camel2DashComponentName: false,
    },
  ],
];

module.exports = { plugins };
