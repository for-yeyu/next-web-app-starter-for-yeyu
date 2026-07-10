import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('..', import.meta.url))

const writeIfChanged = async (path, content) => {
  const currentContent = await readFile(path, 'utf8')

  if (currentContent !== content) {
    await writeFile(path, content)
  }
}

const updateFile = async (path, updater) => {
  const currentContent = await readFile(path, 'utf8')
  const nextContent = updater(currentContent).replace(/\n{3,}/g, '\n\n')

  if (currentContent !== nextContent) {
    await writeFile(path, nextContent)
  }
}

const removePath = async path => {
  await rm(path, {
    force: true,
    recursive: true,
  })
}

const rootPath = path => join(rootDir, path)

const removeJwtSecretFromEnvFiles = async () => {
  const entries = await readdir(rootDir)
  const envFiles = entries.filter(name => name.startsWith('.env'))

  await Promise.all(
    envFiles.map(name =>
      updateFile(rootPath(name), content =>
        content
          .split('\n')
          .filter(line => !line.trimStart().startsWith('JwtSecret='))
          .join('\n')
          .trimEnd()
          .concat('\n'),
      ),
    ),
  )
}

await removeJwtSecretFromEnvFiles()

await writeIfChanged(
  rootPath('src/configs/server-env.ts'),
  `import 'server-only'

export const serverEnv = {}
`,
)

await writeIfChanged(
  rootPath('src/configs/validator/validate-server-env.ts'),
  `import { z } from 'zod'

const serverEnvSchema = z.object({})

export const validateServerEnv = () => {
  serverEnvSchema.parse({})
}
`,
)

await updateFile(rootPath('src/ui/app/(home)/index.tsx'), content =>
  content
    .replace("import Link from 'next/link'\n", '')
    .replace("import { ServerConfig } from './server-config'\n", '')
    .replace(
      `
      <ServerConfig />

      <div className="flex flex-col gap-2">
        <Link className="text-primary hover:underline" href="/examples/server-time">
          Example: Server Time
        </Link>
      </div>`,
      '',
    ),
)

await updateFile(rootPath('src/app/README.md'), content =>
  content.replace('  examples/               # Route entries for examples\n', ''),
)

await updateFile(rootPath('README.md'), content =>
  content.replace(
    `  api/
    time/
      query/
        get-server-time.ts
        test/
          get-server-time.test.ts`,
    `  api/
    <domain>/
      query/
        get-resource.ts
        test/
          get-resource.test.ts`,
  ),
)

await updateFile(rootPath('src/ui/README.md'), content =>
  content.replace(
    `src/app/examples/server-time/page.tsx
src/ui/app/examples/server-time/index.tsx`,
    `src/app/<route>/page.tsx
src/ui/app/<route>/index.tsx`,
  ),
)

await updateFile(rootPath('src/api/README.md'), content =>
  content
    .replace(
      `import { getServerTime } from '@/api/time/query/get-server-time'
import type { GetServerTimeResult } from '@/api/time/types/get-server-time-result'`,
      `import { getResource } from '@/api/<domain>/query/get-resource'
import type { GetResourceResult } from '@/api/<domain>/types/get-resource-result'`,
    )
    .replace(
      `src/api/time/query/
  get-server-time.ts
  test/
    get-server-time.test.ts`,
      `src/api/<domain>/query/
  get-resource.ts
  test/
    get-resource.test.ts`,
    ),
)

await updateFile(rootPath('src/hooks/README.md'), content =>
  content
    .replace(
      `src/api/time/query/get-server-time.ts
src/hooks/api/time/query/use-server-time.ts`,
      `src/api/<domain>/query/get-resource.ts
src/hooks/api/<domain>/query/use-resource.ts`,
    )
    .replace(
      "import { useServerTime } from '@/hooks/api/time/query/use-server-time'",
      "import { useResource } from '@/hooks/api/<domain>/query/use-resource'",
    ),
)

await updateFile(rootPath('src/configs/README.md'), content =>
  content.replace(
    /\nShared public example:[\s\S]*?\n## Checklist For PRs\n/,
    '\n## Checklist For PRs\n',
  ),
)

await updateFile(rootPath('src/app/README.md'), content =>
  content.replace(
    `src/app/api/time/
  route.ts
  test/
    route.test.ts`,
    `src/app/api/<domain>/<resource>/
  route.ts
  test/
    route.test.ts`,
  ),
)

await updateFile(rootPath('src/lib/README.md'), content =>
  content.replace(
    `src/lib/utils/formatter/
  formatters.ts
  test/
    formatters.test.ts`,
    `src/lib/utils/<utility>/
  <utility>.ts
  test/
    <utility>.test.ts`,
  ),
)

// Clear generated route types after removing App Router examples.
await removePath(rootPath('.next'))

const examplePathsToRemove = [
  'src/app/examples/server-time/page.tsx',
  'src/ui/app/examples/server-time/index.tsx',
  'src/app/api/time/route.ts',
  'src/app/api/time/test/route.test.ts',
  'src/api/time/query/get-server-time.ts',
  'src/api/time/query/test/get-server-time.test.ts',
  'src/api/time/types/get-server-time-result.ts',
  'src/hooks/api/time/query/use-server-time.ts',
  'src/lib/utils/formatter/formatters.ts',
  'src/lib/utils/formatter/test/formatters.test.ts',
  'src/app/api/configs/server/route.ts',
  'src/app/api/configs/server/test/route.test.ts',
  'src/api/configs/query/get-server-configs.ts',
  'src/api/configs/query/test/get-server-configs.test.ts',
  'src/api/configs/types/get-server-config-result.ts',
  'src/hooks/api/configs/query/use-server-configs.ts',
  'src/ui/app/(home)/server-config.tsx',
  'src/configs/test/server-env.test.ts',
  'src/configs/validator/test/validate-server-env.test.ts',
]

await Promise.all(examplePathsToRemove.map(path => removePath(rootPath(path))))
