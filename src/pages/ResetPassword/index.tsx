import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useHistory, useLocation } from 'react-router-dom';

import getValidatorErros from '~/utils/getValidatorErros';

import logoImg from '~/assets/logo.svg';

import Button from '~/components/Button';
import Input from '~/components/Input';

import {
  Container, Content, AnimationContainer, Background,
} from './styles';

import { useToast } from '~/hooks/toast';
import api from '~/services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        password: Yup.string().required('Senha obrigatória'),
        password_confirmation: Yup.string().oneOf([Yup.ref('password')], 'Confiração de senha incorreta'),
      });

      await schema.validate(data, { abortEarly: false });

      const { search } = location;

      const params = new URLSearchParams(search);
      const token = params.get('token');

      if (!token) {
        throw new Error('Token is missing');
      }

      const { password, password_confirmation } = data;

      await api.post('/password/reset', {
        password, password_confirmation, token,
      });

      history.push('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const erros = getValidatorErros(err);

        formRef.current?.setErrors(erros);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao resetar senha',
        description: 'Ocorreu um erro ao resetar senha.',
      });
    }
  }, [addToast, location, history]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>
            <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
            <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmação de Senha" />
            <Button type="submit">Alterar Senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>

  );
};

export default ResetPassword;
