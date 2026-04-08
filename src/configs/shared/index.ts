import * as app from './app'
import * as env from './env'

export const sharedConfig = {
  ...app,
  ...env,
}
