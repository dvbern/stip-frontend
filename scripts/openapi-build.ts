import * as fs from 'fs';
import {PathLike} from "fs";
import childProcess = require('child_process');
import path = require('path');


const dependencies = require('../package.json').dependencies;

const ngVersion = dependencies['@angular/core'].replace(/[^0-9.]/, '');
console.log('ngVersion', ngVersion);

function deleteFile(filePath: PathLike) {
  fs.unlinkSync(filePath);
}

function deleteOldFilesSync(directory: string, timestamp: Date) {
  if (!fs.existsSync(directory)) {
    return;
  }

  let files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    if (stats.mtime.getTime() < timestamp.getTime()) {
      deleteFile(filePath);
    }
  }
}

async function generateOpenApi(directory: string, apis: string[]) {
  const env = {
    ...process.env,
    JAVA_OPTS: [
      '-Dmodels',
    ].join(' '),
  };

  const apisString = apis.join(':');

  const typesPath = '../../types';
  const typeMap = [
    // [OpenApi-Name/Format, Typescript-Name, Import-Path]
    ['AnyType', 'object', undefined],
   // ['set', 'FakeSet', typesPath],
    ['date', 'Date', undefined],
    ['Date', 'Date', undefined],
    ['DateTime', 'Date', undefined],
    ['iso-date-string', 'IsoDateString', undefined],
    // ['local-time', 'BackendLocalTime', typesPath],
    // ['local-time-hhmm', 'BackendLocalTimeHHMM', typesPath],
    // ['zoned-date-time', 'BackendZonedDateTime', typesPath],
  //  ['email', 'BackendEmail', typesPath],
    // ['rest-includes', 'RestIncludes', typesPath],
    ['entity-id', 'EntityID', typesPath],
  ];
  const typeMappingsArg = typeMap.map(e => `${e[0]}=${e[1]}`).join(',');
  const importMappingsArg = typeMap.filter(e => !!e[2]).map(e => `${e[1]}=${e[2]}`).join(',');

  const cmd = 'npx openapi-generator-cli generate'
    + ' -i http://localhost:8080/openapi.yml'
    + ' -g typescript-angular'
    + ' --template-dir scripts/conf/openapi-templates'
    + ` --global-property models,apis=${apisString},supportingFiles`
    + ` -p ngVersion=${ngVersion}`
    + ' -p basePath=/'
    + ' -p supportsES6=true'
    + ' -p disallowAdditionalPropertiesIfNotPresent=false'
    + ' -p legacyDiscriminatorBehavior=false'
    // Sortierung: uebernimmt Originalreihenfolge
    + ' -p sortModelPropertiesByRequiredFlag=false'
    + ' -p sortParamsByRequiredFlag=false'
    + ' -p enumPropertyNaming=original'
    // Eindeutiges Naming fuer Service-Methoden und Parameter-Objekte
    + ' -p removeOperationIdPrefix=true'
    + ' -p prefixParameterInterfaces=true'
    // sonst schneidet es bei einigen Enums den vordersten Teil einfach ab, wenn alle Eintraege das gleiche Prefix haben
    + ' -p removeEnumValuePrefix=false'
    + ' -p useSingleRequestParameter=true'
    + ` --type-mappings ${typeMappingsArg}`
    + ` --import-mappings ${importMappingsArg}`
    + ' -o ' + directory;

  console.log('executing command: ', cmd);
  const child = childProcess.exec(
    cmd,
    {env},
  );
  child.stdout?.on('data', data => {
    console.log(data.toString());
  });
  child.stderr?.on('data', data => {
    console.error(data.toString());
  });

  return new Promise<void>(
    (resolve, reject) => {
      child.on('exit', code => code === 0
        ? resolve()
        : reject('exit code: ' + code));
      child.on('error', reject);
    },
  );
}

async function sleep(msec: number) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

// async main
(async () => {
  const timestamp = new Date();
  // noinspection MagicNumberJS
  await sleep(100); // make sure timestamp ticks

  const generatorPath = 'libs/stip-models/src/lib/generated';
  const apiPath = path.join(generatorPath, 'api');
  const modelsPath = path.join(generatorPath, 'model');

  // add more APIs as you go
  // Keep in mind: there is one file generated per OpenAPI-@Tag,
  // Names are CamelCase versions from OpenAPIConst Tags
  const generatedApis = [
    'Fall',
    'Auth',
    'Configuration'
  ];

  await generateOpenApi(generatorPath, generatedApis);

  deleteOldFilesSync(apiPath, timestamp);
  deleteOldFilesSync(modelsPath, timestamp);

})();
