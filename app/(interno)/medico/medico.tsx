import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, TextInput } from "react-native";
import { estilosGlobais } from "../../../styles/estilosGlobais";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cores } from "../../../styles/estilosGlobais"; // Importando as cores

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

      {/* Modal de consulta */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Ficha Médica</Text>
            <Text style={styles.modalNome}>{pokemonSelecionado?.nomePokemon}</Text>
            <TextInput
              style={styles.inputHistorico}
              multiline
              placeholder="Atualização médica..."
              value={historico}
              onChangeText={setHistorico}
            />
            <TouchableOpacity style={styles.botao} onPress={salvarConsulta}>
              <Text style={styles.botaoTexto}>Salvar Atualização</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botao, { backgroundColor: "#e63946" }]} onPress={liberarPokemon}>
              <Text style={styles.botaoTexto}>Liberar Pokémon</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.fechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 12,
    fontFamily: "Roboto", // Tipografia Roboto
    color: cores.textoClaro, // Usando a cor padrão
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
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
    fontFamily: "Roboto", // Tipografia Roboto
    fontSize: 14,
    color: cores.erro, // Usando a cor vermelha do padrão
    marginBottom: 12,
  },
  modalNome: {
    fontSize: 14,
    color: cores.erro, // Usando a cor vermelha do padrão
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Roboto", // Tipografia Roboto
  },
  inputHistorico: {
    borderColor: cores.neutra, // Usando a cor padrão para borda
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 100,
    width: "100%",
    marginTop: 10,
    fontSize: 12,
    fontFamily: "Roboto", // Tipografia Roboto
  },
  botao: {
    backgroundColor: cores.textoClaro, // Cor do botão
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
  },
  botaoTexto: {
    color: "#fff",
    fontFamily: "Roboto", // Tipografia Roboto
    fontSize: 12,
  },
  fechar: {
    marginTop: 10,
    color: cores.erro, // Cor para o fechar
    fontSize: 12,
    fontFamily: "Roboto", // Tipografia Roboto
  },
});