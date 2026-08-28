# Task 2 — Sincronização e adaptador canônico do catálogo

## Implementação

- `apps/web/scripts/sync-catalog.mjs` exporta `syncCatalog`, executa a validação e o check de geração no repositório raiz, valida versão/locales/quantidades e troca a cópia de aplicação por renomeação atômica.
- A cópia é escrita a partir do `Buffer` de origem, sem serialização do JSON; o resultado retorna e o CLI imprime `source`, `destination` e `bytes`.
- `apps/web/src/lib/catalog.ts` é server-only, importa somente `@/generated/catalog.json`, expõe uma instância de catálogo congelada e os três getters públicos.
- `apps/web/src/lib/locales.ts` contém o contrato isomórfico de locales.
- O teste de fundação usa um repositório temporário com locale inválido e confirma que o destino anterior não é alterado.

## Arquivos alterados

- `apps/web/scripts/sync-catalog.mjs` (novo)
- `apps/web/src/lib/catalog.ts` (novo)
- `apps/web/src/lib/catalog.test.ts` (novo)
- `apps/web/src/lib/locales.ts` (novo)
- `apps/web/src/lib/foundation.test.ts` (alterado)

## RED → GREEN

| Comportamento | RED confirmado | GREEN confirmado |
| --- | --- | --- |
| Adaptador canônico | `npm --prefix apps/web test -- src/lib/catalog.test.ts` falhou por não resolver `./catalog`. | Após sincronizar a cópia e implementar o adaptador, o mesmo comando passou: 2 testes. |
| Não substituir destino em catálogo inválido | `npm --prefix apps/web test -- src/lib/foundation.test.ts` falhou por não encontrar `../../scripts/sync-catalog.mjs`. | Após implementar o sincronizador, passou: 2 testes, incluindo preservação de `previous generated catalog`. |

O teste do adaptador mocka somente `server-only`: o pacote lança deliberadamente fora do contexto React Server Components do Vitest; o mock permite testar os getters sem enfraquecer a barreira no código de produção.

## Comandos e resultados

```text
node apps/web/scripts/sync-catalog.mjs
# Validated 18 catalog skills and 6 packs successfully.
# Generated catalog is current.
# Synchronized ...catalog.json -> ...apps/web/src/generated/catalog.json (83900 bytes)

cmp -s catalog/generated/catalog.json apps/web/src/generated/catalog.json
# exit 0 (bytes idênticos)

npm --prefix apps/web test -- src/lib/foundation.test.ts src/lib/catalog.test.ts
# 2 arquivos, 4 testes passaram

npm --prefix apps/web run lint
# exit 0

npm --prefix apps/web run typecheck
# exit 0

npm --prefix apps/web run build
# exit 0; prebuild sincronizou e Next compilou com sucesso
```

`next build` atualizou automaticamente `next-env.d.ts` e `tsconfig.json`; esses efeitos foram restaurados ao baseline da Task 1, pois não fazem parte desta Task e não são necessários para os gates passarem.

## Self-review

- A validação externa ocorre antes de ler ou criar o destino e os invariantes locais ocorrem antes do arquivo temporário.
- A cópia usa os bytes lidos da origem e `renameSync` do temporário irmão para o destino.
- A execução CLI está protegida por comparação do arquivo invocado; importar `syncCatalog` não executa sincronização.
- O adaptador não é importado por `locales.ts`, mantendo locales seguro para cliente.
- `git diff --check` passou e a cópia gerada permanece ignorada, como previsto.

## Concerns

Nenhum bloqueio. O freeze é propositalmente somente de nível superior, conforme o escopo estreito do adaptador; tipos profundos de skills e packs ficam para a PR de Catalog Experience.
