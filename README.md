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


---

## Página de SignUp

- Basicamente criar a pasta `src/pages/SignUp` e copiar a estrutura de `SignIn`

---


## Utilizar o unform

- Para trabalhar com formulário de uma forma performática podemos utilizar uma opção que no caso é o unform, ou até mesmo outras libs como o formik, nesse projeto iremos o unform:


```bash
yarn add @unform/core @unform/web
```

---

- Na página `src/SignUp` adicione a tag `Form` o seguinte:

```tsx
import { Form } from '@unform/web';

// ...

const SignUp: React.FC = () => {
  const handleSubmit = (data: Record<string, string>) : void => {
    console.log(data);
  };

  return (
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="GoBarber" />

        <Form onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>
          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
          <Button type="submit">Cadastrar</Button>
        </Form>

        <a href="login">
          <FiArrowLeft />
          Voltar para logon
        </a>

      </Content>
    </Container>
  );
};
```


---

- No arquivo `src/components/Input` vamos adicionar o `@unform/core`, e adicionar mais alguns parametros:

```tsx
import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

// ...

// utilizamos a prop name
const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest }) => {

  // Adicionar referencia ao input
  const inputRef = useRef(null);

  const {
    fieldName, defaultValue, error, registerField,
  } = useField(name);

  useEffect(() => {
    // Registrar o input no unform
    registerField({
      name: fieldName,
      ref: inputRef.current,
    // No caso seria qual propriedade queremos pegar do elemento da DOM
      path: 'value',
    });
  }, [fieldName, registerField]);

  // O defaultValue utilizamos para quando queremos iniciar o form com um valor padrão:

  /*
    <Form initialData={{name: 'Nome', email: 'email@email.com'}}>
  */

  return (
    <Container>
      { Icon && <Icon size={20} />}
      <input defaultValue={defaultValue} ref={inputRef} {...rest} />
    </Container>
  );
};

export default Input;

```

- Mais detalhes estão nos comentários

---

## Estilização dos inputs

- Melhoramos a estilização do component `src/component/Input` para quando possuí focus, detalhes importantes para fazer isso:

- No arquivo `src/component/Input/index.tsx` foi adicionado o seguinte:

```tsx
// ...
const [isFocused, setIsFocused] = useState(false);
// ...
<Container isFocused={isFocused}>
{/* ... */}
```

- Porém no style desse  `Container` ele não possuí essa propriedade pois ele é uma div, dessa forma o typescript irá acusar erro, para ajustar isso adicionamos uma interface e extendemos ela para o component div assim no arquivo `src/components/Input/styles.ts`:

```ts
interface ContainerProps {
  isFocused: boolean;
}

export const Container = styled.div<ContainerProps>`
  ${/* .. */}

`;
```


---

#### Lei de function dentro de component

**Sempre que for criar uma function dentro de um component, utilizar o useCallback()**


---

## Validação de formulário

- Instalar o yup:

```bash
yarn add yup
```

- Instalar as tipagens:

```bash
yarn add @types/yup -D
```

- Utilizamos o yup em `src/pages/SignUp`:

```tsx
import * as Yup from 'yup';

// ...

const handleSubmit = useCallback(async (data: Record<string, string>) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required('Nome obrigatório'),
      email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
      password: Yup.string().min(6, 'No mínimo 6 digitos'),
    });

    await schema.validate(data, { abortEarly: false });
  } catch (err) {
    console.log(err);
  }
}, []);
```

- utilizamos o `{ abortEarly: false }` para o yup não parar no primeiro erro mas validar tudo.
