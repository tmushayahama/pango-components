# overrep-form



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute        | Description | Type               | Default                                            |
| ----------------- | ---------------- | ----------- | ------------------ | -------------------------------------------------- |
| `exampleGenes`    | --               |             | `string[]`         | `[]`                                               |
| `examplesLabel`   | `examples-label` |             | `string`           | `'Examples'`                                       |
| `geneIdsLabel`    | `gene-ids-label` |             | `string`           | `'Your Gene IDs'`                                  |
| `hint`            | `hint`           |             | `string`           | `'can use UniProt ID/AC, Gene Name, Gene Symbols'` |
| `ontologyLabel`   | `ontology-label` |             | `string`           | `'Ontology'`                                       |
| `ontologyOptions` | --               |             | `OntologyOption[]` | `[]`                                               |
| `showHint`        | `show-hint`      |             | `boolean`          | `true`                                             |
| `species`         | `species`        |             | `string`           | `'HUMAN'`                                          |
| `submitLabel`     | `submit-label`   |             | `string`           | `'Launch'`                                         |
| `submitUrl`       | `submit-url`     |             | `string`           | `'/api/overrep'`                                   |
| `testType`        | `test-type`      |             | `string`           | `'FISHER'`                                         |
| `textareaRows`    | `textarea-rows`  |             | `number`           | `3`                                                |


## Events

| Event           | Description | Type                           |
| --------------- | ----------- | ------------------------------ |
| `overrepSubmit` |             | `CustomEvent<FormSubmitEvent>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
