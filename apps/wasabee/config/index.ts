import remoteConfig from "../generate/config.json";


const localConfig = {}

export const config = {
  ...remoteConfig,
  ...localConfig,
}


