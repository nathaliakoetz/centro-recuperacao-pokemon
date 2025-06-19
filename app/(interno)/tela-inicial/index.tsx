import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from "@expo-google-fonts/roboto"; // Alterando para a fonte Roboto
import { estilosGlobais } from "../../../styles/estilosGlobais";
import { cores } from "../../../styles/estilosGlobais"; // Importando as cores

export default function AreaInterna() {
  const { usuario } = useLocalSearchParams();
  const router = useRouter();
  const opcoes = [
    { titulo: "Cadastrar PokePaciente", rota: "/(interno)/cadastro/cadastro-check" },
    { titulo: "Cadastro Urgente", rota: "/(interno)/cadastro/urgente" },
  ] as const;

  return (
    <View style={estilos.container}>
      <ScrollView contentContainerStyle={estilosGlobais.scroll}>
        <View style={estilosGlobais.topBar}>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        <View style={estilosGlobais.containerCentralizado}>
          <Text style={[estilosGlobais.titulo, { fontSize: 16, marginBottom: 30 }]}>
            Bem-vindo, {usuario}!
          </Text>

          {opcoes.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={estilos.card}
              onPress={() => router.push({ pathname: item.rota })}
            >
              <Text style={estilos.cardTexto}>{item.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundoEscuro, // Cor de fundo escuro
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: 260,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000", // Adicionando sombra para dar profundidade
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5, // Para efeito de sombra no Android
  },
  cardTexto: {
    fontFamily: "Roboto", // Alterando para a fonte Roboto
    fontSize: 14,
    color: cores.vermelho, // Cor mais  destacada para o texto
    textAlign: "center",
  },
});