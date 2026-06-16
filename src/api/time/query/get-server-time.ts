import type { GetServerTimeResult } from '../types/get-server-time-result'
import { apiRequest } from '@/lib/http/ky'

export async function getServerTime(): Promise<GetServerTimeResult> {
  return await apiRequest<GetServerTimeResult>({
    url: 'time',
  })
}
