import { jwtSecret } from '@/configs/jwt-secret'
import { withResponse } from '@/lib/utils/next'

export const GET = withResponse(() => {
  return jwtSecret
})
