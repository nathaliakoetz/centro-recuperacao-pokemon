import { Text, StyleProp, ViewStyle, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { estilosGlobais } from "../styles/estilosGlobais";

// A definição das propriedades
type BotaoLinkProps = {
  href: any;
  children: ReactNode;
  tipo?: 'primario' | 'secundario';
  style?: StyleProp<ViewStyle>;
};

export default function BotaoLink({ href, children, tipo = 'primario', style }: BotaoLinkProps) {
  const router = useRouter();

  const estiloDoBotao = tipo === 'primario' 
    ? estilosGlobais.botaoBase 
    : estilosGlobais.botaoSecundario;
  
  // A função que será chamada ao pressionar o botão
  const handlePress = () => {
    router.push(href);
  };

  return (
    <Pressable style={[estiloDoBotao, style]} onPress={handlePress}>
      <Text style={estilosGlobais.textoBotao}>{children}</Text>
    </Pressable>
  );
}