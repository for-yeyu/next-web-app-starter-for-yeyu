import { jwtSecretConfig } from '@/configs/server'
import { appConfig, env } from '@/configs/shared'
import { JwtSecretButton } from '@/ui/app/jwt-secret-button'

export default function Page() {
  const configEntries = [
    ['shared.app.appName', appConfig.appName],
    ['shared.env.environment', env.environment],
    ['server.jwtSecret.jwtSecret', jwtSecretConfig.jwtSecret],
  ] as const

  return (
    <div className="container">
      <h1>Home</h1>
      <h3>Current Environment Is {env.environment}</h3>
      <JwtSecretButton />

      <div className="mt-6">
        <h3>Configs Values ({configEntries.length})</h3>
        <div className="mt-2 overflow-x-auto rounded-md border border-dashed p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4 font-semibold">Key</th>
                <th className="py-2 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody>
              {configEntries.map(([key, value]) => (
                <tr key={key} className="border-b align-top last:border-b-0">
                  <td className="py-2 pr-4 font-mono">{key}</td>
                  <td className="break-all py-2 font-mono">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
