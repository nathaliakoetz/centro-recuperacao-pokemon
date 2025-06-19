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

export default function EmConsulta() {
  const router = useRouter();
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pokemonSelecionado, setPokemonSelecionado] = useState<any>(null);
  const [historicoTexto, setHistoricoTexto] = useState("");

  useEffect(() => {
    const carregarPokemonsConsulta = async () => {
      try {
        const todasChaves = await AsyncStorage.getAllKeys();
        const chavesPokemons = todasChaves.filter((chave) => chave.startsWith("pokemons:"));
        const resultados = await AsyncStorage.multiGet(chavesPokemons);
        const lista = resultados
          .flatMap(([, valor]) => JSON.parse(valor || "[]"))
          .filter((pokemon) => pokemon.emConsulta && !pokemon.finalizado);
        setPokemons(lista);
      } catch (err) {
        console.error("Erro ao carregar Pokémons em consulta:", err);
      } finally {
        setCarregando(false);
      }
    };

    carregarPokemonsConsulta();
  }, []);

  const abrirModal = (pokemon: any) => {
    setPokemonSelecionado(pokemon);
    setHistoricoTexto("");
    setModalVisivel(true);
  };

  const salvarHistorico = async (idTreinador: string, texto: string) => {
    const chave = `historico:${idTreinador}`;
    const historicoAtual = await AsyncStorage.getItem(chave);
    const historico = historicoAtual ? JSON.parse(historicoAtual) : [];
    historico.push({ data: new Date().toLocaleString(), texto });
    await AsyncStorage.setItem(chave, JSON.stringify(historico));
  };

  const internarPokemon = async () => {
    if (!pokemonSelecionado) return;

    await salvarHistorico(pokemonSelecionado.idTreinador, historicoTexto);
    const chave = `pokemons:${pokemonSelecionado.idTreinador}`;
    const dados = await AsyncStorage.getItem(chave);
    let lista = dados ? JSON.parse(dados) : [];

    lista = lista.map((p: any) => {
      if (p.idTreinador === pokemonSelecionado.idTreinador && p.nomePokemon === pokemonSelecionado.nomePokemon) {
        return { ...p, emConsulta: false, internado: true, finalizado: false };
      }
      return p;
    });

    await AsyncStorage.setItem(chave, JSON.stringify(lista));
    setPokemons(lista.filter((p: any) => p.emConsulta && !p.finalizado));
    setModalVisivel(false);
  };

  const liberarPokemon = async () => {
    if (!pokemonSelecionado) return;

    await salvarHistorico(pokemonSelecionado.idTreinador, historicoTexto);
    const chave = `pokemons:${pokemonSelecionado.idTreinador}`;
    const dados = await AsyncStorage.getItem(chave);
    let lista = dados ? JSON.parse(dados) : [];

    lista = lista.map((p: any) => {
      if (p.idTreinador === pokemonSelecionado.idTreinador && p.nomePokemon === pokemonSelecionado.nomePokemon) {
        return { ...p, emConsulta: false, internado: false, finalizado: true };
      }
      return p;
    });

    await AsyncStorage.setItem(chave, JSON.stringify(lista));
    setPokemons(lista.filter((p: any) => p.emConsulta && !p.finalizado));
    setModalVisivel(false);
  };

  return (
    <View style={estilos.container}>
      <View style={[estilosGlobais.topBar, { marginTop: 40 }]}>
        <TouchableOpacity onPress={() => router.push("/(interno)/medico/medico")}>
          <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={pokemons}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={estilos.lista}
        horizontal // Exibindo os cards horizontalmente
        renderItem={({ item }) => (
          <TouchableOpacity style={estilos.card} onPress={() => abrirModal(item)}>
            <Image source={{ uri: item.imagem }} style={estilos.imagem} />
            <Text style={estilos.nome}>{item.nomePokemon}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal transparent visible={modalVisivel} animationType="fade">
        <View style={estilos.modalFundo}>
          <View style={estilos.modalConteudo}>
            <Image source={{ uri: pokemonSelecionado?.imagem }} style={estilos.imgGrande} />
            <TextInput
              style={estilos.input}
              multiline
              placeholder="Escreva o histórico..."
              value={historicoTexto}
              onChangeText={setHistoricoTexto}
            />
            <TouchableOpacity style={estilos.botao} onPress={internarPokemon}>
              <Text style={estilos.botaoTexto}>Internar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[estilos.botao, { backgroundColor: "#e63946" }]} onPress={liberarPokemon}>
              <Text style={estilos.botaoTexto}>Liberar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Text style={estilos.fechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundoEscuro, // Usando fundo escuro
    padding: 20,
  },
  lista: {
    gap: 16,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    width: 150, // Aumentei o tamanho do card
    marginRight: 10,
    marginBottom: 10,
  },
  imagem: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  nome: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#e63946", // Cor padrão
    fontFamily: "Roboto", // Tipografia Roboto
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
    width: 300, // Ajustando o modal para ser mais quadrado
    alignItems: "center",
  },
  imgGrande: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: "contain",
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