import React, { ChangeEvent, useCallback, useRef } from 'react';
import {
  FiMail, FiLock, FiUser, FiCamera, FiArrowLeft,
} from 'react-icons/fi';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import * as Yup from 'yup';

import { Link, useHistory } from 'react-router-dom';

import api from '~/services/api';

import { useToast } from '~/hooks/toast';

import getValidatorErros from '~/utils/getValidatorErros';

import Button from '~/components/Button';
import Input from '~/components/Input';

import {
  Container, Content, AvatarInput,
} from './styles';
import { useAuth } from '~/hooks/auth';

interface ProfileFromData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        const response = await api.patch('/users/avatar', data);

        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Avatar atualizado!',
        });
      }
    }, [updateUser, addToast],
  );

  const handleSubmit = useCallback(async (data: ProfileFromData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: (val) => !!val.length,
          then: Yup.string().min(6, 'No mínimo 6 digitos'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string().when('old_password', {
          is: (val) => !!val.length,
          then: Yup.string().min(6, 'No mínimo 6 digitos'),
          otherwise: Yup.string(),
        }).oneOf([Yup.ref('password')], 'Confirmação incorreta'),
      });

      await schema.validate(data, { abortEarly: false });

      const {
        name, email, old_password, password, password_confirmation,
      } = data;

      const formData = {
        name,
        email,
        ...old_password ? {
          old_password,
          password,
          password_confirmation,
        } : {},
      };

      const response = await api.put('/profile', formData);

      updateUser(response.data);

      history.push('/dashboard');

      addToast({
        type: 'success',
        title: 'Perfil atualizado!',
        description: 'Suas informações de perfil foram atualizadas com sucesso!',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const erros = getValidatorErros(err);

        formRef.current?.setErrors(erros);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na atualização',
        description: 'Ocorreu um erro ao atualizar perfil, tente novamente.',
      });
    }
  }, [history, addToast, updateUser]);

  return (
    <Container>
      <header>
        <div>
          <Link to="dashboard">
            <FiArrowLeft />

          </Link>
        </div>
      </header>
      <Content>

        <Form
          ref={formRef}
          initialData={{ name: user.name, email: user.email }}
          onSubmit={handleSubmit}
        >

          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <h1>Meu Perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input containerStyle={{ marginTop: 24 }} name="old_password" icon={FiLock} type="password" placeholder="Senha atual" />
          <Input name="password" icon={FiLock} type="password" placeholder="Nova Senha" />
          <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Nova Senha" />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>

      </Content>
    </Container>
  );
};

export default Profile;
