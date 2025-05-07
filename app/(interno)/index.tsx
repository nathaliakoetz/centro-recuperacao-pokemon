import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import TelaCarregamento from "../../components/TelaCarregamento";
import { estilosGlobais } from "../../styles/estilosGlobais";

export default function AreaInterna() {
  const { usuario } = useLocalSearchParams();
  const router = useRouter();
  const [fontesCarregadas] = useFonts({ PressStart2P_400Regular });

  if (!fontesCarregadas) return <TelaCarregamento />;

  const opcoes = [
    { titulo: "Cadastrar PokePaciente", rota: "/(interno)/cadastro-check" },
    { titulo: "Lista de Espera", rota: "/(interno)/espera" },
    { titulo: "Consultas em Andamento", rota: "/(interno)/consultas" },
    { titulo: "Cadastro Urgente", rota: "/(interno)/urgente" },
  ] as const;

  return (
    <ImageBackground
      source={require("../../assets/fundo.jpg")}
      style={estilosGlobais.fundoComOverlay}
      resizeMode="cover"
    >
      <View style={estilosGlobais.fundoComOverlay}>
        <View style={estilosGlobais.containerCentralizado}>
          <Text style={[estilosGlobais.titulo, { fontSize: 16, marginBottom: 30 }]}>
            Bem-vindo, {usuario}!
          </Text>

          {opcoes.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={estilos.card}
              onPress={() => router.push(item.rota)}
            >
              <Text style={estilos.cardTexto}>{item.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTexto: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    color: "#e63946",
    textAlign: "center",
  },
});
