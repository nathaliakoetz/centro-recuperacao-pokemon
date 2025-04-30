import { Text, StyleSheet, View, ImageBackground } from "react-native";
import { Link } from "expo-router";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { useState, useEffect } from "react";
import TelaCarregamento from "../components/TelaCarregamento"; // Importando o componente de carregamento

export default function Home() {
  const [carregando, setCarregando] = useState(true);

  let [fontesCarregadas] = useFonts({
    PressStart2P_400Regular,
  });

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setCarregando(false);
    }, 2000); // Simula 2 segundos de carregamento

    return () => clearTimeout(temporizador);
  }, []);

  if (carregando || !fontesCarregadas) {
    return <TelaCarregamento />;
  }

  return (
    <ImageBackground
      source={require("../assets/fundo.jpg")} 
      style={estilos.container}
      resizeMode="cover" // Garante que a imagem cubra toda a tela
    >
      <View style={estilos.overlay}>
        <Text style={estilos.titulo}>Centro de Recuperação Pokémon</Text>
        <Link href="/login" style={estilos.botao}>
          <Text style={estilos.textoBotao}>Acessar Área Interna</Text>
        </Link>
      </View>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1, // Faz com que a imagem ocupe toda a tela
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlay: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 30,
    color: "#f1faee",
    marginBottom: 30,
    textAlign: "center",
  },
  botao: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  textoBotao: {
    color: "#e63946",
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    fontWeight: "bold",
  },
});
