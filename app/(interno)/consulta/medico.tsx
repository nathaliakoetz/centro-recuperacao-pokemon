import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Modal, TextInput } from "react-native";
import { estilosGlobais } from "../../../styles/estilosGlobais";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getDataAtualFormatada = () => {
  const data = new Date();
  return `${data.toLocaleDateString()} - ${data.toLocaleTimeString()}`;
};

export default function Medico() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [pokemonSelecionado, setPokemonSelecionado] = useState<any>(null);
  const [historico, setHistorico] = useState<string>("");

  const iniciarConsulta = async (pokemon: any) => {
    setPokemonSelecionado(pokemon);
    setModalVisible(true);
  };

  const salvarConsulta = async () => {
    if (!pokemonSelecionado?.idTreinador) return;

    const entradaHistorico = {
      data: new Date().toLocaleString(),
      descricao: historico,
    };

    // Atualiza histórico
    const chaveHistorico = `historico:${pokemonSelecionado.idTreinador}`;
    const historicoAnterior = await AsyncStorage.getItem(chaveHistorico);
    const historicoArray = historicoAnterior ? JSON.parse(historicoAnterior) : [];
    historicoArray.push(entradaHistorico);
    await AsyncStorage.setItem(chaveHistorico, JSON.stringify(historicoArray));

    // Marca como em consulta
    const consultaAtual = {
      ...pokemonSelecionado,
      emConsulta: true,
    };

    await AsyncStorage.setItem(`consultando:${pokemonSelecionado.idTreinador}`, JSON.stringify(consultaAtual));

    setHistorico("");
    setModalVisible(false);
  };

  const liberarPokemon = async () => {
    if (!pokemonSelecionado?.idTreinador) return;

    const chaveInternado = `internados:${pokemonSelecionado.idTreinador}`;
    await AsyncStorage.removeItem(chaveInternado);

    setModalVisible(false);
  };

  return (
    <ImageBackground source={require("../../../assets/fundo.jpg")} style={estilosGlobais.fundoComOverlay} resizeMode="cover">
      <View style={estilosGlobais.topBar}>
        <TouchableOpacity onPress={() => router.push("/(interno)/tela-inicial")}> 
          <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/login")}> 
          <Text style={estilosGlobais.linkTopo}>Logoff</Text>
        </TouchableOpacity>
      </View>

      <Text style={[estilosGlobais.titulo, { marginBottom: 10 }]}>Bem-vindo Dr. Oak</Text>
      <Text style={[estilosGlobais.linkTopo, { textAlign: "center", marginBottom: 20 }]}>{getDataAtualFormatada()}</Text>

      <View style={styles.barraMenu}>
        <TouchableOpacity onPress={() => router.push("/(interno)/consulta/espera")}> 
          <Text style={styles.linkBarra}>PokePacientes em Espera</Text> 
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(interno)/consulta/emConsulta")}> 
          <Text style={styles.linkBarra}>Consultas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(interno)/consulta/internacao")}> 
          <Text style={styles.linkBarra}>Internação</Text> 
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  barraMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginBottom: 20,
  },
  linkBarra: {
    fontSize: 10,
    fontFamily: "PressStart2P_400Regular",
    color: "#fff",
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalConteudo: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  modalTitulo: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 12,
    color: "#e63946",
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 10,
    fontFamily: "PressStart2P_400Regular",
    color: "#333",
    marginVertical: 4,
    textAlign: "center",
  },
  inputHistorico: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 100,
    width: "100%",
    marginTop: 10,
    fontSize: 10,
  },
});