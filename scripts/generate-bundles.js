#!/usr/bin/env node

// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

/*
 stencil 'dist-custom-elements' does not support assets copying, so we do it manually
 */
const fs = require('fs');
const path = require('path');
const rollup = require('rollup');

const LOGTAG = 'generate-bundles';

const PROJECT_ROOT = path.normalize(path.join(__dirname, '../'));

///
(async function () {

  console.log(`[${LOGTAG}] generate bundles`);
  console.log(`[${LOGTAG}] using "rollup" v${rollup.VERSION}`);

  const bundlesConfigFile = path.join(PROJECT_ROOT, 'bundle-config/bundles.json');

  // read config
  const fileContent = fs.readFileSync(bundlesConfigFile, 'utf8');
  const fileData = JSON.parse(fileContent);

  for (let i = 0; i < fileData.length; i++) {
    const bundleConfig = fileData[i];
    await _generateBundle(bundleConfig, bundleConfig.name || ('job-' + i));
  }
  console.log(`[${LOGTAG}] done`);
})().catch(e => {
  console.error(e);
  process.exit(1);
});

/**
 * @param config {object}
 * @param config.entryPoint {string} bundle entry point
 * @param config.outputDir {string} bundle folder
 * @param [config.copy] {Array<{src:string, dst:string}>} copy assets
 * @param jobName {string} job name
 */
async function _generateBundle(config, jobName) {

  const entryPoint = path.join(PROJECT_ROOT, config.entryPoint);
  const entryFilename = path.basename(config.entryPoint);

  const targetDir = path.join(PROJECT_ROOT, config.outputDir);
  const targetFile = path.join(PROJECT_ROOT, config.outputDir, entryFilename);

  // clear output folder
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, {recursive: true});
  }

  //// create a bundle
  console.log(`[${LOGTAG}]   generate bundle "${entryFilename}"`);
  await rollup.rollup({
    input: entryPoint,
    treeshake: false, // already shaken by stencil
  }).then(b => b.write({
    file: targetFile,
  }));

  //// copy assets
  if (config.copy?.length) {
    for (const copyConfig of config.copy) {

      const srcFile = path.join(PROJECT_ROOT, copyConfig.src);
      const srcFilename = path.basename(srcFile);
      const dstFile = path.join(PROJECT_ROOT, config.outputDir, copyConfig.dst, srcFilename);

      console.log(`[${LOGTAG}]   copy "${srcFilename}"`);
      fs.cpSync(srcFile, dstFile, {recursive: true});
    }
  }

  console.log(`[${LOGTAG}] (${jobName}) done `);
}
