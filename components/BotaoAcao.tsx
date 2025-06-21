import { Text, StyleProp, ViewStyle, Pressable, PressableProps, GestureResponderEvent, } from 'react-native';
import { ReactNode } from 'react';
import { estilosGlobais } from '../styles/estilosGlobais';

interface BotaoAcaoProps extends PressableProps {
  children: ReactNode;
  tipo?: 'primario' | 'secundario';
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
  const estiloDoBotao =
    tipo === 'primario'
      ? estilosGlobais.botaoBase
      : estilosGlobais.botaoSecundario;

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