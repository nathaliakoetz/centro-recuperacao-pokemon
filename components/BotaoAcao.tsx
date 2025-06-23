import { Text, StyleProp, ViewStyle, Pressable, PressableProps } from 'react-native';
import { ReactNode } from 'react';
import { estilosGlobais, cores } from '../styles/estilosGlobais';

interface BotaoAcaoProps extends PressableProps {
  children: ReactNode;
  tipo?: 'primario' | 'secundario' | 'urgente';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export default function BotaoAcao({
  children,
  onPress,
  tipo = 'primario',
  style,
  disabled,
  ...rest
}: BotaoAcaoProps) {
  
  const getEstiloDoBotao = () => {
    switch (tipo) {
      case 'secundario':
        return estilosGlobais.botaoSecundario;
      case 'urgente':
        return { ...estilosGlobais.botaoBase, backgroundColor: cores.erro };
      case 'primario':
      default:
        return estilosGlobais.botaoBase;
    }
  };

  const estiloDoBotao = getEstiloDoBotao();

  return (
    <Pressable
      style={({ pressed }) => [
        estiloDoBotao,
        style,
        pressed && { opacity: 0.8 },
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled}
      {...rest}
    >
      <Text style={estilosGlobais.textoBotao}>{children}</Text>
    </Pressable>
  );
}