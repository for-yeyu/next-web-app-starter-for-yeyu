import { env } from '@/configs/env'
import { JwtSecretButton } from '@/ui/app/jwt-secret-button'

export default function Page() {
  return (
    <div className="container">
      <h1>Home</h1>
      <h3>Current Environment Is {env.environment}</h3>
      <JwtSecretButton />
    </div>
  )
}
