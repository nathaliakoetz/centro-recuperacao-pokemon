import { Text, StyleSheet, View } from "react-native";
import BotaoLink from "../components/BotaoLink";
import { estilosGlobais } from "../styles/estilosGlobais";
import { cores } from "../styles/estilosGlobais"; // Importando cores

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={estilosGlobais.fundoComOverlay}>
        <View style={estilosGlobais.containerCentralizado}>
          <Text style={estilosGlobais.titulo}>Centro de Recuperação Pokémon</Text>
          <BotaoLink href="/login">Acessar Área Interna</BotaoLink>
          <BotaoLink href="/loginMedico">Acessar Área Médica</BotaoLink>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundoEscuro, // Cor de fundo escuro
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "Roboto", // Aplicando a fonte Roboto
  },
});