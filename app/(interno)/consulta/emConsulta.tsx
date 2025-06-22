import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import {
  estilosGlobais,
  cores,
  espacamento,
  bordas,
  sombras,
  tipografia,
} from "../../../styles/estilosGlobais";
import { PokemonCadastro } from "../../../utils/salvarPokemon";
import BotaoAcao from "../../../components/BotaoAcao";

const calcularNumColunas = () => {
  const larguraTela = Dimensions.get('window').width;
  if (larguraTela > 1200) return 4;
  if (larguraTela > 900) return 3;
  if (larguraTela > 600) return 2;
  return 1;
};

const formatData = (data: any[], numColumns: number) => {
  const dataClone = [...data];
  const numberOfFullRows = Math.floor(dataClone.length / numColumns);
  let numberOfElementsLastRow =
    dataClone.length - numberOfFullRows * numColumns;
  while (
    numberOfElementsLastRow !== numColumns &&
    numberOfElementsLastRow !== 0
  ) {
    dataClone.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }
  return dataClone;
};

export default function EmConsulta() {
  const [pokemons, setPokemons] = useState<PokemonCadastro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pokemonSelecionado, setPokemonSelecionado] = useState<PokemonCadastro | null>(null);
  const [historicoTexto, setHistoricoTexto] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [numColunas, setNumColunas] = useState(calcularNumColunas());
  const [termoBusca, setTermoBusca] = useState('');
  
  const router = useRouter();

  const carregarPokemons = async () => {
    setCarregando(true);
    try {
      const todasChaves = await AsyncStorage.getAllKeys();
      const chavesPokemons = todasChaves.filter((chave) => chave.startsWith("pokemons:"));
      const resultados = await AsyncStorage.multiGet(chavesPokemons);
      const lista: PokemonCadastro[] = resultados
        .flatMap(([, valor]) => JSON.parse(valor || "[]"))
        .filter((pokemon) => pokemon.emConsulta && !pokemon.finalizado);
      setPokemons(lista);
    } catch (err) {
      console.error("Erro ao carregar Pokémons em consulta:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPokemons();
    const subscription = Dimensions.addEventListener('change', () => {
      setNumColunas(calcularNumColunas());
    });
    return () => subscription?.remove();
  }, []);

  const abrirModal = (pokemon: PokemonCadastro) => {
    setPokemonSelecionado(pokemon);
    setHistoricoTexto("");
    setModalVisivel(true);
  };
  
  const atualizarStatusPokemon = async (updates: Partial<PokemonCadastro>) => {
    if (!pokemonSelecionado) return;
    if (!historicoTexto.trim()) {
      Alert.alert("Atenção", "É necessário adicionar uma anotação ao histórico antes de continuar.");
      return;
    }

    setIsUpdating(true);
    
    const chave = `pokemons:${pokemonSelecionado.idTreinador}`;
    const dados = await AsyncStorage.getItem(chave);
    if (!dados) {
        setIsUpdating(false);
        return;
    }

    let lista: PokemonCadastro[] = JSON.parse(dados);
    const historicoAtual = pokemonSelecionado.historico || [];
    const novoHistorico = [...historicoAtual, { data: new Date().toLocaleString(), descricao: historicoTexto }];
    
    lista = lista.map((p) =>
      p.nomePokemon === pokemonSelecionado.nomePokemon ? { ...p, ...updates, historico: novoHistorico } : p
    );

    await AsyncStorage.setItem(chave, JSON.stringify(lista));
    await carregarPokemons();
    setIsUpdating(false);
    setModalVisivel(false);
  };
  
  const internarPokemon = () => atualizarStatusPokemon({ emConsulta: false, internado: true });
  const liberarPokemon = () => atualizarStatusPokemon({ emConsulta: false, finalizado: true });

  const pokemonsFiltrados = useMemo(() => {
    if (!termoBusca) {
      return pokemons;
    }
    return pokemons.filter(
      (p) =>
        p.nomePokemon.toLowerCase().includes(termoBusca.toLowerCase()) ||
        (p.nomeTreinador && p.nomeTreinador.toLowerCase().includes(termoBusca.toLowerCase()))
    );
  }, [pokemons, termoBusca]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (item.empty === true) {
      return <View style={styles.cardContainer} />;
    }

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={500}
        delay={index * 100}
        style={styles.cardContainer}
      >
        <TouchableOpacity onPress={() => abrirModal(item)}>
          <View style={[styles.card, item.urgente && styles.cardUrgente]}>
            {item.urgente && <Text style={styles.tagUrgente}>URGENTE</Text>}
            <Image source={{ uri: item.imagem }} style={styles.imagemCard} />
            <Text style={styles.nomePokemon} numberOfLines={1}>{item.nomePokemon}</Text>
            <View style={styles.detalheContainer}>
              <Feather name="user" size={14} color={cores.textoSecundario} />
              <Text style={styles.detalheCard} numberOfLines={1}>
                {item.nomeTreinador || '-'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(interno)/medico/medico')}>
          <Image source={require('../../../assets/voltar.png')} style={styles.voltarIcon} />
        </TouchableOpacity>
        <View style={styles.containerTituloHeader}>
          <Text style={styles.titulo}>Em Consulta</Text>
          {!carregando && (
            <Text style={styles.contador}>
              {pokemonsFiltrados.length} pacientes em atendimento
            </Text>
          )}
        </View>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.containerBusca}>
        <Feather name="search" size={20} color={cores.textoSecundario} />
        <TextInput
          style={styles.campoBusca}
          placeholder="Buscar por nome do Pokémon ou Treinador..."
          placeholderTextColor={cores.textoSecundario}
          value={termoBusca}
          onChangeText={setTermoBusca}
        />
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color={cores.primaria} style={{ flex: 1 }} />
      ) : pokemonsFiltrados.length > 0 ? (
        <FlatList
          data={formatData(pokemonsFiltrados, numColunas)}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.key || item.nomePokemon}-${index}`}
          numColumns={numColunas}
          key={String(numColunas)}
        />
      ) : (
        <View style={styles.containerVazio}>
          <Image source={require('../../../assets/consulta.png')} style={styles.imagemVazio} />
          <Text style={styles.tituloVazio}>Nenhum paciente em consulta</Text>
          <Text style={styles.subtituloVazio}>Inicie uma consulta a partir da Fila de Espera.</Text>
        </View>
      )}

      <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={() => setModalVisivel(false)}>
        <View style={estilosGlobais.modalFundo}>
          <View style={[styles.modalContainer, {flexDirection: Dimensions.get('window').width >= 768 ? 'row' : 'column'}]}>
            <View style={styles.colunaFormulario}>
              <Text style={styles.modalTitulo}>{pokemonSelecionado?.nomePokemon}</Text>
              <Text style={styles.modalSubtitulo}>Ficha de Atendimento</Text>
              
              <Text style={estilosGlobais.label}>Adicionar atualização ao histórico *</Text>
              <TextInput
                style={[estilosGlobais.campoMultilinha, {height: 150}]}
                placeholder="Ex: Paciente apresentou melhora..."
                placeholderTextColor={cores.textoSecundario}
                value={historicoTexto}
                onChangeText={setHistoricoTexto}
                multiline
              />

              <View style={styles.modalBotoesContainer}>
                <BotaoAcao onPress={internarPokemon} tipo="secundario" style={styles.modalBotao} disabled={isUpdating}>
                    {isUpdating ? <ActivityIndicator/> : "Internar"}
                </BotaoAcao>
                <BotaoAcao onPress={liberarPokemon} style={styles.modalBotao} disabled={isUpdating}>
                    {isUpdating ? <ActivityIndicator/> : "Liberar Alta"}
                </BotaoAcao>
              </View>

              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Text style={styles.modalFechar}>Cancelar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.colunaImagem}>
              <Image source={{ uri: pokemonSelecionado?.imagem }} style={styles.modalImagem} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: espacamento.l, marginBottom: espacamento.s, },
  voltarIcon: { width: 30, height: 30, tintColor: cores.textoClaro, },
  containerTituloHeader: { alignItems: 'center', },
  titulo: { ...estilosGlobais.titulo, marginBottom: 0, },
  contador: { fontFamily: tipografia.familia, fontSize: tipografia.tamanhos.label, color: cores.textoSecundario, },
  containerBusca: { flexDirection: 'row', alignItems: 'center', backgroundColor: cores.fundoSuperficie, borderRadius: bordas.raioMedio, paddingHorizontal: espacamento.l, marginHorizontal: espacamento.l, marginBottom: espacamento.l, ...sombras.sombraMedia, },
  campoBusca: { flex: 1, paddingVertical: espacamento.m, paddingLeft: espacamento.m, color: cores.textoClaro, fontFamily: tipografia.familia, },
  cardContainer: { flex: 1, padding: espacamento.s, },
  card: { backgroundColor: cores.fundoSuperficie, borderRadius: bordas.raioMedio, padding: espacamento.l, ...sombras.sombraMedia, alignItems: 'center', width: '100%', },
  cardUrgente: { borderColor: cores.erro, borderWidth: 2, },
  tagUrgente: { position: 'absolute', top: 0, right: 0, backgroundColor: cores.erro, color: cores.branco, paddingHorizontal: espacamento.m, paddingVertical: espacamento.xs, borderTopRightRadius: bordas.raioMedio, borderBottomLeftRadius: bordas.raioMedio, fontFamily: tipografia.familia, fontSize: tipografia.tamanhos.pequeno, fontWeight: tipografia.pesos.bold, },
  imagemCard: { width: 140, height: 140, resizeMode: 'contain', marginBottom: espacamento.m, },
  nomePokemon: { fontFamily: tipografia.familia, fontSize: tipografia.tamanhos.subtitulo, fontWeight: tipografia.pesos.bold, color: cores.textoClaro, marginBottom: espacamento.s, },
  detalheContainer: { flexDirection: 'row', alignItems: 'center', gap: espacamento.s, },
  detalheCard: { fontFamily: tipografia.familia, fontSize: tipografia.tamanhos.label, color: cores.textoSecundario, },
  containerVazio: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: espacamento.xl, },
  imagemVazio: { width: 150, height: 150, marginBottom: espacamento.xl, resizeMode: 'contain', },
  tituloVazio: { fontFamily: tipografia.familia, fontSize: tipografia.tamanhos.subtitulo, color: cores.textoClaro, textAlign: 'center', marginBottom: espacamento.s, },
  subtituloVazio: { fontFamily: tipografia.familia, fontSize: tipografia.tamanhos.corpo, color: cores.textoSecundario, textAlign: 'center', },
  modalContainer: { flexDirection: 'row', backgroundColor: cores.fundoSuperficie, borderRadius: bordas.raioGrande, width: '90%', maxWidth: 800, ...sombras.sombraMedia, overflow: 'hidden' },
  colunaFormulario: { flex: 1.5, padding: espacamento.xl, },
  colunaImagem: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.fundoEscuro, },
  modalImagem: { width: '80%', height: 200, resizeMode: 'contain', },
  modalTitulo: { fontFamily: tipografia.familia, fontSize: tipografia.tamanhos.titulo, color: cores.textoClaro, },
  modalSubtitulo: { fontFamily: tipografia.familia, fontSize: tipografia.tamanhos.corpo, color: cores.textoSecundario, marginBottom: espacamento.l, },
  modalBotoesContainer: { flexDirection: 'row', gap: espacamento.m, marginTop: espacamento.m, width: '100%' },
  modalBotao: { flex: 1 },
  modalFechar: { fontFamily: tipografia.familia, fontSize: tipografia.tamanhos.label, color: cores.textoSecundario, marginTop: espacamento.xl, textDecorationLine: 'underline', textAlign: 'center', },
});