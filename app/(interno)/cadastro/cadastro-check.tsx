import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { estilosGlobais } from "../../../styles/estilosGlobais";
import { cores } from "../../../styles/estilosGlobais"; // Importando cores

export default function CadastroCheck() {
  return (
    <View style={estilos.container}>
      <ScrollView contentContainerStyle={estilosGlobais.scroll}>
        <View style={estilosGlobais.topBar}>
          <TouchableOpacity onPress={() => router.push("/(interno)/tela-inicial")}>
            <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={estilosGlobais.linkTopo}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={estilosGlobais.containerCentralizado}>
          <Text style={[estilosGlobais.titulo, { fontSize: 14, marginBottom: 30 }]}>
            O Pokémon já está cadastrado?
          </Text>
          
          <View style={estilos.botoes}>
            <TouchableOpacity
              style={[estilos.botao, { backgroundColor: cores.azulEscuro }]}
              onPress={() => router.push("/(interno)/cadastro/buscar-id")}
            >
              <Text style={estilos.textoBotao}>Sim</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[estilos.botao, { backgroundColor: cores.vermelho }]}
              onPress={() => router.push("/(interno)/cadastro/cadastro")}
            >
              <Text style={estilos.textoBotao}>Não</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundoEscuro, // Usando o fundo escuro
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  botoes: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    marginTop: 30,
  },
  botao: {
    backgroundColor: cores.azulEscuro, // Cor de fundo dos botões
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: "bold",
  },
});