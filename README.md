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


---

## Exibindo os erros

- Vamos adicionar os erros para cada input que tiver um erro,

- Antes iremos criar uma function para tratar as mensagens dos erros em `src/utils/getValidatorErros.ts`:

```ts
import { ValidationError } from 'yup';


// Retrata um objeto de strings
// no qual a key do object é uma string e o valor da key é uma string
interface Erros {
  [key: string]: string;
}

const getValidatorErros = (erros: ValidationError) : Erros => {
  const validators: Erros = {};

  erros.inner.forEach((error) => {
    validators[error.path] = error.message;
  });

  return validators;
};

export default getValidatorErros;

```

- Para isso precisamos pegar a referencia do formulário e setar os erros recebido do yup:

```tsx
import * as Yup from 'yup';

import { FormHandles } from '@unform/core';

import getValidatorErros from '~/utils/getValidatorErros';

// ...

const formRef = useRef<FormHandles>(null);

// ...

const handleSubmit = useCallback(async (data: Record<string, string>) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'No mínimo 6 digitos'),
      });

      await schema.validate(data, { abortEarly: false });
    } catch (err) {
      const erros = getValidatorErros(err);

      // precisamos desabilitar no eslint: "no-unused-expressions": "off"
      // Pois ele acha que estamos tentando realizar um if ternario...
      formRef.current?.setErrors(erros);

      console.log(err);
    }
  }, []);

<Form ref={formRef} onSubmit={handleSubmit}>


```

**No eslintrc.json precisamos altarar uma regra**

```json
"no-unused-expressions": "off"
```

- Por fim no componente `src/components/Input` adicionamos `{error}`:

```tsx
<input
  onFocus={handleInputFocus}
  onBlur={handleInputBlur}
  defaultValue={defaultValue}
  ref={inputRef}
  {...rest}
/>
{error}
```


---

## Herança de estilo de outros componentes

- Um exemplo foi feito, criando o componente `src/components/Tooltip`:

```tsx
import React from 'react';

import { Container } from './styles';

interface TooltipProps {
  title: string;
  className?: string; // Quando iremos estilizar o componente em outro css precisamos inserir essa prop, pois a estilização em herança é feita pela class
}

const Tooltip: React.FC<TooltipProps> = ({ title, className, children }) => {
  const a = [];

  return (
    {/* Quando iremos estilizar o component em outro css precisamos inserir essa prop, pois a estilização em herança é feita pela class */}
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>

  );
};

export default Tooltip;


```

- Por fim dentro de `src/components/Input/styles`:

```ts
import Tooltip from '~/components/Tooltip';

//...
export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;
  svg {
    margin: 0;
  }
`;
```

---

## Hacking para centralizar horizontalmente o position absolute

- No arquivo `src/components/Tooltip/styles.ts`

```ts
position: absolute;
left: 50%;
transform: translateX(-50%);
```

---

## Hacking para fazer triangulo no css

```ts
span::before {
  content: '';
  border-style: solid;
  border-color: #ff9000 transparent;
  border-width: 6px 6px 0 6px;
  top: 100%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
```

---

## Como fazer o component Tootilp

- Detalhes no arquivo `src/components/Tooltip` e no `src/componets/Input` verificar a Tag Error e seu estilo

---

## Context API

- Inicialmente criar o arquivo `src/context/AuthContext.ts`

- Nesse arquivo definimos o nosso context:

```ts
import { createContext } from 'react';

interface AuthContextData {
  name: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default AuthContext;

```

- Inserimos ele em `src/App.tsx` para que todos que estejam dentro dele possam acessar:

```tsx
import AuthContext from '~/context/AuthContext';

const App: React.FC = () => (
  <>
    <AuthContext.Provider value={{ name: 'Meu nome' }}>
      <SignIn />
    </AuthContext.Provider>
    <GlobalStyle />
  </>
);

export default App;
```

- E no arquivo `src/pages/SignIn` por exemplo podemos obter os valores do context:

```tsx
import React, { useContext } from 'react';
//...

import AuthContext from '~/context/AuthContext';

const SignIn: React.FC = () => {
  const { name } = useContext(AuthContext);

  console.log(name);
  //...

};
```

---

## Ajustes no context Api

- Realizamos ajustes em `src/contex/AuthContext.tsx`:

```tsx
import React, { createContext, useCallback } from 'react';

interface AuthContextData {
  name: string;
  signIn(): void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const signIn = useCallback(() => {}, []);

  return (
    <AuthContext.Provider value={{ name: 'Rodo', signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

```

- E agora em `src/App.tsx` chamamos o AuthProvider:

```tsx
import React, { createContext, useCallback } from 'react';

interface AuthContextData {
  name: string;
  signIn(): void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const signIn = useCallback(() => {}, []);

  return (
    <AuthContext.Provider value={{ name: 'Rodo', signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

```

- Vamos deixar instalado o `axios`:

```bash
yarn add axios
```

- Criar o arquivo `src/services/api.ts` para definir configurações do axios

---

### useState utilizando function ao inicializar

- Em geral para iniciar um useState sob alguma condição utilizamos o useEffect, porém nem sempre precisamos utiliza-lo ainda mais que é necessário definir uma série de dependencias nele que podem ser alteradas causando chamadas desnecessárias a ele, dessa forma podemos utilizar uma function que retorna o valor inicial do nosso estado conforme alguma condição, um exemplo disso temos em `src/context/AuthContext.tsx`:

```tsx
const [data, setData] = useState<IAuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as IAuthState;
  });
```

---

## Hook do context

- Para não precisar importar o useContext do React e o Provider toda vez que iremos utilizar o context, podemos utilizar o recurso de criação de hooks, que basicamente são functions que não retorna um component em si, mas sim functions encapsuladas, um exemplo da criação do hook temos em `src/context/AuthContext.tsx`:

```tsx
const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used withn an AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuth };
```

- Por fim utilizamos o hook em `src/pages/SignIn`:

```tsx
// ...
import { useAuth } from '~/context/AuthContext';
// ...
const { user, signIn } = useAuth();
// ...
```

---

## Criação de Toas

- Foi criado um component toast para aviso ao usuário em `src/components/ToastContainer`

- Algo interessantes sobre a estilização com o typescript, em `src/components/ToastContainer/styles.ts`:

```ts

// Criada interface para definir props aceitas pelo component
interface ToastProps {
  type? : 'success' | 'error' | 'info';
  hasDescription: boolean;
}

// Definido css adicional dependendo do type que for passado para o component
const toastTypeVariations = {
  info: css`
    background: #ebf8ff;
    color: #3172b2;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #fddede;
    color: #c53030;
  `,
};

// aplicando o type conforme for enviado pelo component <Toast type="success" hasDescription={false}>
export const Toast = styled.div<ToastProps>`
  ${(props) => toastTypeVariations[props.type || 'info']}
`;
```


## Context para o Toast

- Basicamente o mínimo para criação de um context com hook:

```tsx
import React, { createContext, useContext, useCallback } from 'react';

interface ToastContextData {
  addToast(): void;
  removeToast(): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const addToast = useCallback(() => {
    console.log('addToast');
  }, []);

  const removeToast = useCallback(() => {
    console.log('removeToast');
  }, []);

  return (

    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

const useToast = (): ToastContextData => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export { ToastProvider, useToast };

```


---

## Context Dentro do App

- Para o código do `App.tsx` ficar mais limpo, para não ter tanto component de provider, podemos utilizar um component que conterá todos os providers e esse componente irá encapsular o App.

- Crie o arquivo `src/hooks/index.tsx`:

```tsx
import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>
      {children}
    </ToastProvider>
  </AuthProvider>
);

export default AppProvider;

```

- Por fim dentro de `src/App.tsx` adicionamos o Provider

```tsx
import React from 'react';
import GlobalStyle from '~/styles/global';
import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';

import AppProvider from '~/hooks';

const App: React.FC = () => (
  <>
    <AppProvider>
      <SignIn />
    </AppProvider>

    <GlobalStyle />
  </>
);

export default App;

```


---

- Para utilizar um id unico que iremos utilizar no toast iremos instalar o uuid:

```bash
yarn add uuidv4
```

---

- Uma forma de obter o state anterior sem precisar ter o primeiro elemento do useState como dependencia de function podemos utilizar o recurso de function do useState, um exemplo disso temos em `src/hooks/toast.tsx`:

```tsx
const [messages, setMessages] = useState<ToastMessage[]>([]);

const addToast = useCallback(({ type, title, description }: Omit<ToastMessage, 'id'>) => {
  const id = uuid();

  const toast = {
    id,
    type,
    title,
    description,
  };

  // Obtendo o valor anterior do estado
  setMessages((state) => [...state, toast]);
}, []);
```

---

- Podemos também exportar interface para serem reutilizada em outros arquivos, um exemplo disso está em `src/hooks/toast.tsx` e `src/components/ToastContainer/index.tsx`


---

## Animações com React

- Uma forma de animar componentes em react é utilizando uma dependência react-sptring:

```bash
yarn add react-spring
```


- No elemento Toast especificamente iremos utilizar o `useTransition` do react-spring
- [useTransiction](https://www.react-spring.io/docs/hooks/use-transition)

- Um exemplo de como está sendo utilizado está em `src/components/ToastContainer/index.tsx`:

```tsx
// ...
import { useTransition } from 'react-spring';
// ...

const messageWithTransitions = useTransition(
  messages, // items[{}]
  (message) => message.id, // map do item para obter uma chave unica
  // css do spring
  {
    from: { right: '-120%', opacity: 0, transform: 'rotate(180deg)' }, // inicio
    enter: { right: '0%', opacity: 1, transform: 'rotate(0deg)' }, // ao entrar
    leave: { right: '-120%', opacity: 0, transform: 'rotate(180deg)' }, // ao sair, ou quando objeto for deixar de existir

  },
);


// Adicionaodo a prop style no component Toast
// ...
{messageWithTransitions.map(({ item, key, props }) => (
  <Toast key={key} style={props} message={item} />
))}
// ...
```

- Por fim em `src/components/ToastContainer/Toast/` adicionamos o seguinte:

```tsx
// ...
<Container
      type={message.type}
      hasDescription={!!message.description}
      style={style}
    >
// ...
```

**Importante**

- E para poder funcionar o react spring, ele precisa estar no elment `animated` conforme `src/components/ToastContainer/Toast/styles.ts`:

```ts
// ...
import { animated } from 'react-spring';

// ...

export const Container = styled(animated.div)<ContainerProps>`
  ${/* ... */}
`;

// ...
```

**/Importante**


---

## Rotas

- Inicialmente instale a dependencia:

```bash
yarn add react-router-dom
```

- Instalar types:


```bash
yarn add @types/react-router-dom -D
```

- Criar a pasta `src/routes` e por fim o arquivo `src/routes/index.tsx`

```tsx
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />
  </Switch>
);

export default Routes;

```

- E no arquivo `src/App.tsx` adicionar as rotas:

```tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyle from '~/styles/global';
import Routes from './routes';

import AppProvider from '~/hooks';

const App: React.FC = () => (
  <Router>
    <AppProvider>
      <Routes />
    </AppProvider>

    <GlobalStyle />
  </Router>
);

export default App;

```

---

## Rota Dashboard

- Criar a página `src/pages/Dashboard`


### Rotas privadas

- Criar o arquivo `src/routes/Route.tsx`

```tsx
import React from 'react';
import { Route as ReactDOMRoute, RouteProps as ReactDOMRouteProps, Redirect } from 'react-router-dom';

import { useAuth } from '~/hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType; // Para utilizar o component no formato de nome e não no formato de Tag <Component/>
}

const Route: React.FC<RouteProps> = ({ isPrivate = false, component: Component, ...rest }) => {
  const { user } = useAuth();

// utilizamos o location para nessas troca de rotas não perder o histórico
  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => (isPrivate === !!user ? (
        <Component />
      ) : (
        <Redirect to={{ pathname: isPrivate ? '/' : '/dashboard', state: { from: location } }} />
      ))}
    />
  );
};

export default Route;

```

- Por fim no arquivo `src/routes/index.tsx` ajustamos:

```tsx
import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';

import Dashboard from '~/pages/Dashboard';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
  </Switch>
);

export default Routes;

```
