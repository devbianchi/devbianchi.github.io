# devbianchi.github.io

Portfólio de página única em HTML, CSS e JavaScript puros. Sem build e sem dependências externas.

## Editar o conteúdo

Todo o texto está em `res/profile.json`. Altere o arquivo e recarregue a página.

## Rodar localmente

O site carrega o JSON em tempo de execução, então `file://` não funciona:

    python3 -m http.server 4173

Depois abra http://localhost:4173.

## Publicar no GitHub Pages

1. Crie o repositório `devbianchi.github.io` e envie estes arquivos para a branch `main`.
2. Em Settings > Pages, escolha "Deploy from a branch", branch `main`, pasta `/ (root)`.
3. O site fica em https://devbianchi.github.io.

## Fontes

Fraunces, Space Grotesk e Space Mono, todas sob a SIL Open Font License (arquivos em `fonts/`).
