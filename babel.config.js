
const presets = [
  [
    "@babel/env",
    {
      targets: { // указать цели, для полифилов
            edge: "17",
            ie: "11",
            firefox: "50",
            chrome: "64",
            safari: "11.1",
      },
      useBuiltIns: "usage", // эта настройка babel-polyfill, если стоит значение usage, то будут подставлятся полифилы для версий браузеров которые указали ниже.
      corejs: "3.4.1" // явно проставить версию corejs
    }
  ],
];

const plugins = [
  "@babel/plugin-proposal-class-properties",
]

module.exports = { presets, plugins };