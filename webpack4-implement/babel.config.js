module.exports = function (api) {
  api.cache(true)
  return {
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "ie": 8
          }
        }
      ],
      "@babel/preset-react" // 编译 JSX
    ],
    "plugins": [
      [
        "@babel/plugin-transform-template-literals",
        {
          "loose": true
        }
      ]
    ],
    "compact": true,
  }
}
