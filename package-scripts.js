const { series } = require('nps-utils');

module.exports = {
  scripts: {
    doc: {
      description: 'Documenting the API.',
      generate: {
        description: 'Generate Documentation files',
        script: 'apidoc -i src',
      },
      deploy: {
        description: 'Deploy the docs to surge.',
        script: series('nps doc.generate', 'surge ./doc'),
      },
    },
  }
}
