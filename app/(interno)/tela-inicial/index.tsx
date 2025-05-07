import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import TelaCarregamento from "../../../components/TelaCarregamento";
import { estilosGlobais } from "../../../styles/estilosGlobais";

export default function AreaInterna() {
  const { usuario } = useLocalSearchParams();
  const router = useRouter();
  const [fontesCarregadas] = useFonts({ PressStart2P_400Regular });

  if (!fontesCarregadas) return <TelaCarregamento />;

  const opcoes = [
    { titulo: "Cadastrar PokePaciente", rota: "/(interno)/cadastro/cadastro-check" },
    { titulo: "Lista de Espera", rota: "/(interno)/consulta/espera" },
    { titulo: "Consultas em Andamento", rota: "/(interno)/consulta/consultas" },
    { titulo: "Cadastro Urgente", rota: "/(interno)/urgente/urgente" },
  ] as const;

  return (
    <ImageBackground
      source={require("../../../assets/fundo.jpg")}
      style={estilosGlobais.fundoComOverlay}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={estilosGlobais.scroll}>
        <View style={estilosGlobais.topBar}>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        <View>
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
      </ScrollView>
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
