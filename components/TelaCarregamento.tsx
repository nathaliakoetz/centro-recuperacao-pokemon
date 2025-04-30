import { View, StyleSheet, ActivityIndicator, ImageBackground } from "react-native";
import * as Animatable from "react-native-animatable";

export default function TelaCarregamento() {
  return (
    <ImageBackground
      source={require("../assets/fundo.jpg")} // Imagem de fundo
      style={estilos.container}
      resizeMode="cover"
    >
      <ActivityIndicator size="large" color="#E63946" />
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
});