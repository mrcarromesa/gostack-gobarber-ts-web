import React, {
  useEffect, useRef, useState, useCallback, CSSProperties,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  // icon?: React.ComponentType<{size: string}>;
  icon?: React.ComponentType<IconBaseProps>;
  containerStyle?: CSSProperties;
}

const Input: React.FC<InputProps> = ({
  name, icon: Icon, containerStyle = {}, ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const {
    fieldName, defaultValue, error, registerField,
  } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  useEffect(() => {
    setIsFilled(!!inputRef.current?.value);
  }, []);

  return (
    <Container data-testid="input-container" style={containerStyle} isErrored={!!error} isFilled={isFilled} isFocused={isFocused}>
      { Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
      {error && <Error title={error}><FiAlertCircle color="#c53030" size={20} /></Error>}
    </Container>
  );
};

export default Input;
