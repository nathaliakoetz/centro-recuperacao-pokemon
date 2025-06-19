import { Text, StyleProp, ViewStyle, Pressable, PressableProps, GestureResponderEvent } from "react-native";
import { ReactNode } from "react";
import { estilosGlobais } from "../styles/estilosGlobais";

// propriedades que o botão pode receber
interface BotaoAcaoProps {
  children: ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  tipo?: 'primario' | 'secundario';
  style?: StyleProp<ViewStyle>;
}

export default function BotaoAcao({ children, onPress, tipo = 'primario', style }: BotaoAcaoProps) {
  const estiloDoBotao = tipo === 'primario' 
    ? estilosGlobais.botaoBase 
    : estilosGlobais.botaoSecundario;

  return (
    <Pressable
      style={({ pressed }) => [
        estiloDoBotao,
        style,
        pressed && { opacity: 0.8 } // Efeito de feedback ao pressionar
      ]}
      onPress={onPress}
    >
      <Text style={estilosGlobais.textoBotao}>{children}</Text>
    </Pressable>
  );
}