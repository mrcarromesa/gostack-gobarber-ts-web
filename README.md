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


---

### Isolando componentes

- Criar a pasta `src/components`

- Criamos o component/Input

- importamos na página de SignIn no lugar dos inputs normais do Html,

- Porém agora começou a dar vários erros, pois como nosso component Input retorna um input ele precisa ter todos os atributos do input html pois do contrário irá gerar erros no typescript, dessa forma para resolver esse erros extendemos o componente input para uma nova interface na qual podemos informar quais atributos serão obrigatórios e ignorar os demais que não precisarão ser obrigatórios:

```tsx
import React from 'react';

import { Container } from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const Input: React.FC<InputProps> = (props) => (
  <Container>
    <input type="text" {...props} />
  </Container>
);

export default Input;

```

- O eslint irá acusar erros no sprading operetor, pois ele obriga que seja informado todos os atributos ao invés de simplesmente enviar tudo, para o eslint não reclamar isso podemos desabilitar essa regra no eslintrc.json:

```json
"react/jsx-props-no-spreading": "off"
```

- No caso do componente button como não iremos adicionar ou sobrescrever nenhuma propriedade podemos transformar em um type:

```tsx
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => <button type="button" {...rest}>{children}</button>;

export default Button;

```

- O eslint irá acusar a falta da definição dos proptypes, mas como utilizamos o typescript não faz sentido ter que utilizar o proptypes, então podemos ignorar essa regra no `.eslintrc.json`:

```json
"react/prop-types": "off"
```

---

### Passando Um elemento pelo props de outro elemento

- No `src/pages/SignIn` queremos enviar o icone para o componente input:

```tsx
// ...
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import Input from '~/components/Input';
// ...

const SignIn: React.FC = () => (
  {/* ... */}
  <Input name="email" icon={FiMail} placeholder="E-mail" />
  {/* ... */}
}

```

- Estamos passando na prop icon um icone do `react-icons`

- Agora no component `src/components/Input/` podemos obter essa propriedade:

```tsx
import { IconBaseProps } from 'react-icons';
// import { Container } from './styles';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  // icon?: React.ComponentType<{size: string}>;
  icon?: React.ComponentType<IconBaseProps>;
}
```

- Nesse caso acima como a dependencia do react-icons nos fornece uma forma de obter essas prop utilizamos isso:

```tsx
icon?: React.ComponentType<IconBaseProps>;
```

- Mas se não poderiamos utilizar:

```tsx
icon?: React.ComponentType<{size: string, color: string}>;
```

- E por fim nosso componente `src/components/Input` fica assim:

```tsx
import React from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  // icon?: React.ComponentType<{size: string}>;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({ icon: Icon, ...rest }) => (
  <Container>
    { Icon && <Icon size={20} />}
    <input type="text" {...rest} />
  </Container>
);

export default Input;

```
