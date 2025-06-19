import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { estilosGlobais } from "../../../styles/estilosGlobais";
import { useRouter } from "expo-router";
import { cores } from "../../../styles/estilosGlobais"; // Importando as cores

const larguraTela = Dimensions.get("window").width;

function calcularNumColunas() {
  if (larguraTela >= 1200) return 4;
  if (larguraTela >= 768) return 2;
  return 1;
}

export default function ListaEspera() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [numColunas, setNumColunas] = useState(calcularNumColunas());
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pokemonNome, setPokemonNome] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    const carregarPokemons = async () => {
      try {
        const todasChaves = await AsyncStorage.getAllKeys();
        const chavesPokemons = todasChaves.filter((chave) => chave.startsWith("pokemons:"));
        const resultados = await AsyncStorage.multiGet(chavesPokemons);
        const lista = resultados.flatMap(([, valor]) => JSON.parse(valor || "[]")) as any[];

        const filtrados = lista.filter(
          (p) => !p.emConsulta && !p.internado && !p.finalizado
        );

        const ordenados = filtrados.sort((a, b) => {
          if (a.urgente && !b.urgente) return -1;
          if (!a.urgente && b.urgente) return 1;
          return 0;
        });

        setPokemons(ordenados);
      } catch (err) {
        console.error("Erro ao carregar lista de espera:", err);
      } finally {
        setCarregando(false);
      }
    };

    const atualizarColunas = () => {
      const largura = Dimensions.get("window").width;
      if (largura >= 1200) setNumColunas(4);
      else if (largura >= 768) setNumColunas(2);
      else setNumColunas(1);
    };

    carregarPokemons();
    atualizarColunas();

    const subscription = Dimensions.addEventListener("change", atualizarColunas);
    return () => subscription?.remove();
  }, []);

  const enviarParaConsulta = async (pokemon: any) => {
    const chave = `pokemons:${pokemon.idTreinador}`;
    const dados = await AsyncStorage.getItem(chave);
    if (!dados) return;

    const lista = JSON.parse(dados) as any[];
    const novaLista = lista.map((p) =>
      p.nomePokemon === pokemon.nomePokemon ? { ...p, emConsulta: true } : p
    );

    await AsyncStorage.setItem(chave, JSON.stringify(novaLista));
    setPokemons((prev) => prev.filter((p) => p.nomePokemon !== pokemon.nomePokemon));
    setPokemonNome(pokemon.nomePokemon);
    setModalVisivel(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View
      style={[item.urgente ? styles.cardUrgente : styles.cardBranco, { width: larguraTela / numColunas - 32 }]}
    >
      <Image source={{ uri: item.imagem }} style={styles.imagemCard} />
      <View style={styles.infoCard}>
        <Text style={styles.nomePokemon}>{item.nomePokemon}</Text>
        <Text style={styles.nomeTreinador}>{item.nomeTreinador || "-"}</Text>
        <Text style={styles.descricao}>{item.descricao || "Sem descrição"}</Text>
        <TouchableOpacity style={styles.botaoConsulta} onPress={() => enviarParaConsulta(item)}>
          <Text style={styles.textoBotao}>IR PARA CONSULTA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={[estilosGlobais.topBar, { marginTop: 40 }]}>
        <TouchableOpacity onPress={() => router.push("/(interno)/medico/medico")}>
          <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={pokemons}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.lista}
        numColumns={numColunas}
      />

      {/* Modal de confirmação de consulta */}
      <Modal transparent visible={modalVisivel} animationType="fade">
        <View style={modalStyles.modalFundo}>
          <View style={modalStyles.modalConteudo}>
            <Text style={estilosGlobais.titulo}>POKÉMON EM CONSULTA</Text>
            <Text style={modalStyles.texto}>
              O Pokémon <Text style={{ fontWeight: "bold" }}>{pokemonNome}</Text> foi enviado para a consulta com sucesso!
            </Text>
            <TouchableOpacity style={modalStyles.botaoFechar} onPress={() => setModalVisivel(false)}>
              <Text style={modalStyles.textoFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
    justifyContent: "center",
  },
  cardBranco: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    margin: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  cardUrgente: {
    flexDirection: "row",
    backgroundColor: "#e63946",
    borderRadius: 20,
    padding: 16,
    margin: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  imagemCard: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 12,
  },
  infoCard: {
    flex: 1,
  },
  nomePokemon: {
    fontSize: 18,
    fontWeight: "bold",
    color: cores.textoClaro, // Usando a cor padrão
    marginBottom: 4,
    fontFamily: "Roboto", // Tipografia Roboto
  },
  nomeTreinador: {
    fontSize: 14,
    fontStyle: "italic",
    color: cores.textoClaro, // Usando a cor padrão
    marginBottom: 6,
    fontFamily: "Roboto", // Tipografia Roboto
  },
  descricao: {
    fontSize: 14,
    color: cores.textoClaro, // Usando a cor padrão
    marginBottom: 10,
    fontFamily: "Roboto", // Tipografia Roboto
  },
  botaoConsulta: {
    backgroundColor: "#2a9d8f",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  textoBotao: {
    color: "#fff",
    fontFamily: "Roboto", // Tipografia Roboto
    fontSize: 8,
    textAlign: "center",
  },
});

const modalStyles = StyleSheet.create({
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalConteudo: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    gap: 20,
    width: "80%",
  },
  texto: {
    fontSize: 14,
    color: cores.textoClaro, // Usando a cor padrão
    textAlign: "center",
    fontFamily: "Roboto", // Tipografia Roboto
  },
  botaoFechar: {
    backgroundColor: "#2a9d8f",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  textoFechar: {
    color: "#fff",
    fontFamily: "Roboto", // Tipografia Roboto
    fontSize: 10,
  },
});