import path from 'path'

export const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

export const getAssetPath = (...paths: string[]): string => {
  const RESOURCES_PATH = isDev
    ? path.join(__dirname, '../../assets')
    : path.join(process.resourcesPath, 'assets')
  
  return path.join(RESOURCES_PATH, ...paths)
}