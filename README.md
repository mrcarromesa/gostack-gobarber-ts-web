# Gobarber Web

- Iniciando e configurando o projeto: [Projeto com React Typescript](https://github.com/mrcarromesa/gostack-fundamentos-reactjs)


---

## Estilo Globais

- Iniicalmente instale a lib:

```bash
yarn add styled-components
```

- E as tipagens:

```bash
yarn add @types/styled-components -D
```


- Criar o arquivo `src/styles/global.ts`

---

## Página de login

- Criar o arquivo `src/pages/SignIn/index.tsx` e o arquivo `src/pages/SignIn/styles.ts`

- Adicionar a dependencia:

```bash
yarn add react-icons
```

- Adicionar a dependencia:

```bash
yarn add polished
```

**Dica**

- O `place-content: center;` equivale ao `justify-content: center;` e o `align-items: center;`

### Elemento relativo

- No arquivo `src/pages/SignIn/styles.ts` temos o seguinte caso:

```ts
> a {
  //...
}

```

- Isso serve para dizer que será estilizado o a apenas dentro daquele container e não os acimas do container
- Mais detalhes em [Elementos relativos CSS](https://github.com/mrcarromesa/react-redux-parte1#elementos-relativos-css)
