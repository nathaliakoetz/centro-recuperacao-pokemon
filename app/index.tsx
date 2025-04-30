import { Text, StyleSheet, View, ImageBackground } from "react-native";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { useState, useEffect } from "react";
import TelaCarregamento from "../components/TelaCarregamento";
import BotaoLink from "../components/BotaoLink";
import { estilosGlobais } from "../styles/estilosGlobais";

export default function Home() {
  const [carregando, setCarregando] = useState(true);
  let [fontesCarregadas] = useFonts({ PressStart2P_400Regular });

  useEffect(() => {
    const timer = setTimeout(() => setCarregando(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (carregando || !fontesCarregadas) return <TelaCarregamento />;

  return (
    <ImageBackground
      source={require("../assets/fundo.jpg")}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    >
      <View style={estilosGlobais.fundoComOverlay}>
        <View style={estilosGlobais.containerCentralizado}>
          <Text style={estilosGlobais.titulo}>Centro de Recuperação Pokémon</Text>
          <BotaoLink href="/login">Acessar Área Interna</BotaoLink>
        </View>
      </View>
    </ImageBackground>
  );
}
