import { View, Text, StyleSheet, Button, ImageBackground } from "react-native";
import { router } from "expo-router";
import { estilosGlobais } from "../../styles/estilosGlobais";

export default function CadastroCheck() {
  return (
    <ImageBackground
      source={require("../../assets/fundo.jpg")}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    >
      <View style={estilosGlobais.fundoComOverlay}>
        <View style={estilosGlobais.containerCentralizado}>
          <Text style={[estilosGlobais.titulo, { fontSize: 14, marginBottom: 30 }]}>
            O Pokémon já está cadastrado?
          </Text>
          <View style={styles.botoes}>
            <Button
              title="Sim"
              onPress={() => router.push("/(interno)/buscar-id")}
              color="#2a9d8f"
            />
            <Button
              title="Não"
              onPress={() => router.push("/(interno)/cadastro")}
              color="#e63946"
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  botoes: {
    flexDirection: "row",
    gap: 20,
  },
});