module.exports = {
  'src/**/*.{ts,tsx,js,vue}': ['eslint --fix', 'prettier --write'],
  'src/**/*.{css,less,scss,vue}': ['stylelint --fix'],
  '*.{json,md,html}': ['prettier --write'],
  'tests/**/*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
};
