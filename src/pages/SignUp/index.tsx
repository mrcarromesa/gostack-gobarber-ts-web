import React, { useCallback, useRef } from 'react';
import {
  FiArrowLeft, FiMail, FiLock, FiUser,
} from 'react-icons/fi';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import * as Yup from 'yup';

import { Link, useHistory } from 'react-router-dom';

import api from '~/services/api';

import { useToast } from '~/hooks/toast';

import getValidatorErros from '~/utils/getValidatorErros';

import logoImg from '~/assets/logo.svg';

import Button from '~/components/Button';
import Input from '~/components/Input';

import {
  Container, Content, AnimationContainer, Background,
} from './styles';

interface SignUpFromData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const history = useHistory();

  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: SignUpFromData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'No mínimo 6 digitos'),
      });

      await schema.validate(data, { abortEarly: false });

      await api.post('/users', data);

      history.push('/');

      addToast({
        type: 'success',
        title: 'Cadastro realizado!',
        description: 'Você já pode realizar seu logon no GoBarber!',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const erros = getValidatorErros(err);

        formRef.current?.setErrors(erros);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro ao realizar cadastro, tente novamente.',
      });
    }
  }, [history, addToast]);

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>

          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} initialData={{ name: 'Nome', email: 'email@email.com' }} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>

        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
