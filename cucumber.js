const common = {
  require: ['support/**/*.js', 'step-definitions/**/*.js'],
  format: ['progress-bar', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
};
module.exports = {
  default: { ...common, tags: 'not @selfheal' },
  selfheal: { ...common, tags: '@selfheal', format: ['progress', 'html:reports/selfheal-report.html'] },
};
