# Copa do Mundo — Simulador Interativo

Simulador de Copa do Mundo com 86 seleções: escolha do formato (16 ou 32 times), sorteio de grupos por potes, fase de grupos com classificação e mata-mata até a final, com disputa de 3º lugar.

**Acesse:** https://waltercneto.github.io/CopaDoMundo/

## Como funciona

- A força de cada seleção usa pontos no estilo do ranking FIFA (aproximados e editáveis na tela inicial).
- As probabilidades de cada jogo (vitória/empate/derrota) vêm de um modelo tipo Elo sobre a diferença de pontos; a chance de empate decai com a diferença de força.
- Os placares são gerados por distribuição de Poisson, coerentes com o resultado sorteado. No mata-mata há chance de decisão nos pênaltis.
- **Toda probabilidade pode ser sobrescrita manualmente** antes de simular cada jogo ("Ajustar prob."), caso o usuário entenda que a estimativa do modelo não está adequada.

## Estrutura

| Arquivo | Descrição |
| --- | --- |
| `index.html` | Página publicada no GitHub Pages |
| `app.js` | Bundle de produção (React + simulador, gerado com esbuild) |
| `src/App.jsx` | Código-fonte do componente React |
| `src/entry.jsx` | Ponto de entrada (render no `#root`) |

## Rebuild (opcional)

Só é necessário se você alterar o código-fonte em `src/`:

```bash
npm install react@18 react-dom@18 esbuild
npx esbuild src/entry.jsx --bundle --minify --format=iife \
  --loader:.jsx=jsx --define:process.env.NODE_ENV='"production"' \
  --outfile=app.js
```

## Licença

MIT
