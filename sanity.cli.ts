/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from "sanity/cli";
import envConfig from "./envConfig";

const projectId = envConfig.sanityProjectId;
const dataset = envConfig.sanityDataset;

export default defineCliConfig({ api: { projectId, dataset } });
