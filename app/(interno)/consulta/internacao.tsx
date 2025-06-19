import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { estilosGlobais } from "../../../styles/estilosGlobais";
import { cores } from "../../../styles/estilosGlobais"; // Importando as cores
import { useRouter } from "expo-router";
import { PokemonCadastro } from "../../../utils/salvarPokemon";

export default function Internacao() {
  const router = useRouter();
  const [internados, setInternados] = useState<PokemonCadastro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pokemonSelecionado, setPokemonSelecionado] = useState<PokemonCadastro | null>(null);
  const [novaAtualizacao, setNovaAtualizacao] = useState("");

  useEffect(() => {
    const carregarInternados = async () => {
      try {
        const todasChaves = await AsyncStorage.getAllKeys();
        const chavesPokemons = todasChaves.filter((k) => k.startsWith("pokemons:"));
        const registros = await AsyncStorage.multiGet(chavesPokemons);

        const todosPokemons: PokemonCadastro[] = registros
          .flatMap(([, val]) => JSON.parse(val || "[]"))
          .filter((p: PokemonCadastro) => p.internado && !p.finalizado);

        setInternados(todosPokemons);
      } catch (err) {
        console.error("Erro ao buscar internados:", err);
      } finally {
        setCarregando(false);
      }
    };
    carregarInternados();
  }, []);

  const abrirModal = (pokemon: PokemonCadastro) => {
    setPokemonSelecionado(pokemon);
    setNovaAtualizacao("");
    setModalVisivel(true);
  };

  const liberarPokemon = async () => {
    if (!pokemonSelecionado) return;

    const chave = `pokemons:${pokemonSelecionado.idTreinador}`;
    const dados = await AsyncStorage.getItem(chave);
    if (!dados) return;

    const lista: PokemonCadastro[] = JSON.parse(dados);

    const novaLista = lista.map((p) =>
      p.nomePokemon === pokemonSelecionado.nomePokemon
        ? { ...p, internado: false, finalizado: true }
        : p
    );

    await AsyncStorage.setItem(chave, JSON.stringify(novaLista));
    setInternados(novaLista.filter((p) => p.internado && !p.finalizado));
    setModalVisivel(false);
  };

  const salvarAtualizacao = async () => {
    if (!pokemonSelecionado) return;

    const chave = `historico:${pokemonSelecionado.idTreinador}`;
    const historicoAtual = await AsyncStorage.getItem(chave);
    const historico = historicoAtual ? JSON.parse(historicoAtual) : [];

    historico.push({
      data: new Date().toLocaleString(),
      texto: novaAtualizacao,
    });

    await AsyncStorage.setItem(chave, JSON.stringify(historico));
    setNovaAtualizacao("");
  };

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={[estilosGlobais.topBar, { marginTop: 40 }]}>
        <TouchableOpacity onPress={() => router.push("/(interno)/medico/medico")}>
          <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={internados}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => abrirModal(item)}>
            <Image source={{ uri: item.imagem }} style={styles.imagem} />
            <Text style={styles.nome}>{item.nomePokemon}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal transparent visible={modalVisivel} animationType="fade">
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Ficha Médica</Text>
            <Text style={styles.modalNome}>{pokemonSelecionado?.nomePokemon}</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Atualização médica..."
              value={novaAtualizacao}
              onChangeText={setNovaAtualizacao}
            />
            <TouchableOpacity style={styles.botao} onPress={salvarAtualizacao}>
              <Text style={styles.botaoTexto}>Salvar Atualização</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botao, { backgroundColor: "#e63946" }]}
              onPress={liberarPokemon}
            >
              <Text style={styles.botaoTexto}>Liberar Pokémon</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Text style={styles.fechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  lista: {
    padding: 20,
    gap: 16,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    width: 150,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  imagem: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  nome: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#e63946",
    fontFamily: "Roboto", // Usando a tipografia Roboto
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
    fontSize: 16,
    color: "#2a9d8f", // Cor do título do modal
    fontFamily: "Roboto", // Tipografia Roboto
    marginBottom: 10,
  },
  modalNome: {
    fontSize: 14,
    color: "#e63946", // Cor do nome do Pokémon
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Roboto", // Tipografia Roboto
  },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 12,
    fontFamily: "Roboto", // Tipografia Roboto
  },
  botao: {
    backgroundColor: "#2a9d8f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
  },
  botaoTexto: {
    color: "#fff",
    fontFamily: "Roboto", // Tipografia Roboto
    fontSize: 8,
  },
  fechar: {
    marginTop: 10,
    color: "#e63946",
    fontSize: 10,
    fontFamily: "Roboto", // Tipografia Roboto
  },
});