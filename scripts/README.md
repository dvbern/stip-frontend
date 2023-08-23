# Usage

This tool is used to generate the Model and Interface definition from the defined contract. See https://gitlab.dvbern.ch/kibon/stip-contract/

**Update the OpenAPI contract file:**

- `npm i @kibon/stip-contract@latest`

**Generate the models**

- Delete everything at `libs\shared\model\gesuch\src\lib\openapi` to make sure that obsolete models are cleaned up.
- `npm run openapi`
