import { View, Text, StyleSheet, Button, ImageBackground, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { estilosGlobais } from "../../../styles/estilosGlobais";

export default function CadastroCheck() {
  return (
    <ImageBackground
      source={require("../../../assets/fundo.jpg")}
      style={estilosGlobais.fundoComOverlay}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={estilosGlobais.scroll}>
        <View style={estilosGlobais.topBar}>
          <TouchableOpacity onPress={() => router.push("/(interno)/tela-inicial")}>
            <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={estilosGlobais.linkTopo}>Logout</Text>
          </TouchableOpacity>
        </View>
      

      <View >
        <View style={estilosGlobais.containerCentralPadding}>
          <Text style={[estilosGlobais.titulo, { fontSize: 14, marginBottom: 30 }]}>
            O Pokémon já está cadastrado?
          </Text>
          <View style={styles.botoes}>
            <Button
              title="Sim"
              onPress={() => router.push("/(interno)/cadastro/buscar-id")}
              color="#2a9d8f"
            />
            <Button
              title="Não"
              onPress={() => router.push("/(interno)/cadastro/cadastro")}
              color="#e63946"
            />
          </View>
        </View>
      </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  botoes: {
    flexDirection: "row",
    gap: 20,
  },
});