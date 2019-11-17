require('dotenv').config();

const { series } = require('nps-utils');

const surgeCommand = process.env.API_WEBSITE_URL.length !== 0
  ? `surge ./doc -d ${process.env.API_WEBSITE_URL}`
  : 'surge ./doc';

module.exports = {
  scripts: {
    coverage: {
      description: 'Generate code coverage report',
      run: {
        description: 'Run code coverage along with test',
        script: 'nyc --reporter=lcov --reporter=text mocha tests',
      },
    },
    load: {
      description: 'Run Load Testing',
      script: series('forever start index.js', 'artillery run artillery.yml', 'forever stop index.js'),
    },
    lint: {
      description: 'Run linting',
      script: series('eslint src/', 'eslint tests/'),
    },
    test: {
      description: 'Run Test',
      script: series('nps lint', 'nps coverage.run'),
    },
    doc: {
      description: 'Documenting the API.',
      generate: {
        description: 'Generate Documentation files',
        script: 'apidoc -i src',
      },
      deploy: {
        description: 'Deploy the docs to surge.',
        script: series('nps doc.generate', surgeCommand),
      },
    },
  },

};
