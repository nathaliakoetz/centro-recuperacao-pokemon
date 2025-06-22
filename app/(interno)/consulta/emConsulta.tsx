import { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
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
import { PokemonCadastro, EntradaHistorico } from "../../../utils/salvarPokemon";
import BotaoAcao from "../../../components/BotaoAcao";
import { buscarDadosPorEspecie, DadosPokemon } from "../../../utils/pokeapi";

export default function EmConsulta() {
  const [pokemons, setPokemons] = useState<PokemonCadastro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pokemonSelecionado, setPokemonSelecionado] = useState<PokemonCadastro | null>(null);
  const [pokemonDetalhesAPI, setPokemonDetalhesAPI] = useState<DadosPokemon | null>(null);
  const [historicoTexto, setHistoricoTexto] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [medicaoSelecionada, setMedicaoSelecionada] = useState(false);
  const [curativoSelecionada, setCurativoSelecionada] = useState(false);

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
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPokemons();
    }, [])
  );

  const abrirModal = async (pokemon: PokemonCadastro) => {
    setPokemonSelecionado(pokemon);
    setHistoricoTexto("");
    setMedicaoSelecionada(false);
    setCurativoSelecionada(false);

    if (pokemon.especiePokemon) {
      const detalhes = await buscarDadosPorEspecie(pokemon.especiePokemon);
      setPokemonDetalhesAPI(detalhes);
    } else {
      setPokemonDetalhesAPI(null);
    }

    setModalVisivel(true);
  };

  const atualizarStatusPokemon = async (updates: Partial<PokemonCadastro>) => {
    if (!pokemonSelecionado) return;

    const tags = [];
    if (medicaoSelecionada) tags.push("MEDICAÇÃO");
    if (curativoSelecionada) tags.push("CURATIVO");

    const prefixo = tags.length > 0 ? `[${tags.join(', ')}] ` : '';
    const descricaoFinal = `${prefixo}${historicoTexto}`;

    if (!descricaoFinal.trim()) {
      Alert.alert("Atenção", "É necessário adicionar uma anotação ao histórico ou selecionar uma opção antes de continuar.");
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
    const novoHistorico = [...historicoAtual, { data: new Date().toLocaleString(), descricao: descricaoFinal }];

    lista = lista.map((p) =>
      p.nomePokemon === pokemonSelecionado.nomePokemon ? { ...p, ...updates, historico: novoHistorico } : p
    );

    await AsyncStorage.setItem(chave, JSON.stringify(lista));
    await carregarPokemons();
    setIsUpdating(false);
    setModalVisivel(false);
  };

  const internarPokemon = () => {
    return atualizarStatusPokemon({ emConsulta: false, internado: true });
  };
  const liberarPokemon = () => {
    return atualizarStatusPokemon({ emConsulta: false, finalizado: true });
  };

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

  const renderItem = ({ item, index }: { item: PokemonCadastro; index: number }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      delay={index * 100}
    >
      <TouchableOpacity onPress={() => abrirModal(item)}>
        <View style={[styles.card, item.urgente && styles.cardUrgente]}>
          {item.urgente && <Text style={styles.tagUrgente}>URGENTE</Text>}
          <Image source={{ uri: item.imagem }} style={styles.imagemCard} />
          <Text style={styles.nomePokemon} numberOfLines={1}>{item.nomePokemon}</Text>

          <View style={styles.tipoContainer}>
            {item.tipoPokemon.split(',').map((tipo: string) => (
              <View key={tipo} style={styles.tipoTag}>
                <Text style={styles.tipoTexto}>{tipo.trim()}</Text>
              </View>
            ))}
          </View>

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
          data={pokemonsFiltrados}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.nomePokemon}-${index}`}
          contentContainerStyle={styles.listaContainer}
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
          <View style={estilosGlobais.modalConteudo}>
            <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setModalVisivel(false)}>
              <Feather name="x" size={24} color={cores.textoSecundario} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <View style={styles.colunaImagem}>
                <Image source={{ uri: pokemonSelecionado?.imagem }} style={styles.modalImagem} />
              </View>
              <View style={styles.modalHeaderContent}>
                <Text style={styles.modalTitulo}>{pokemonSelecionado?.nomePokemon}</Text>
                <Text style={styles.modalSubtitulo}>Ficha de Atendimento</Text>
              </View>
              <View style={styles.modalBodyContent}>
                <View style={styles.descricaoContainer}>
                  <Text style={styles.descricaoLabel}>Descrição Inicial do Caso:</Text>
                  <Text style={styles.descricaoTexto}>
                    {pokemonSelecionado?.descricao}
                  </Text>
                </View>

                {pokemonDetalhesAPI?.fraquezas && pokemonDetalhesAPI.fraquezas.length > 0 && (
                  <View style={styles.fraquezasContainer}>
                    <Text style={styles.fraquezasLabel}>Fraquezas:</Text>
                    <View style={styles.tipoContainer}>
                      {pokemonDetalhesAPI.fraquezas.map((fraqueza: string) => (
                        <View key={fraqueza} style={styles.fraquezaTag}>
                          <Text style={styles.tipoTexto}>{fraqueza.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.opcoesContainer}>
                  <TouchableOpacity
                    style={[
                      styles.opcaoBotao,
                      medicaoSelecionada && styles.opcaoBotaoSelecionado,
                    ]}
                    onPress={() => setMedicaoSelecionada(!medicaoSelecionada)}
                  >
                    <Text style={styles.opcaoTexto}>Medicação</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.opcaoBotao,
                      curativoSelecionada && styles.opcaoBotaoSelecionado,
                    ]}
                    onPress={() => setCurativoSelecionada(!curativoSelecionada)}
                  >
                    <Text style={styles.opcaoTexto}>Curativo</Text>
                  </TouchableOpacity>
                </View>

                <Text style={estilosGlobais.label}>Adicionar atualização ao histórico *</Text>
                <TextInput
                  style={[estilosGlobais.campoMultilinha, { height: 120 }]}
                  placeholder="Ex: Paciente apresentou melhora..."
                  placeholderTextColor={cores.textoSecundario}
                  value={historicoTexto}
                  onChangeText={setHistoricoTexto}
                  multiline
                />
              </View> {/* Fim modalBodyContent */}
            </ScrollView> {/* Fim ScrollView */}

            {/* Botões de ação fixos na parte inferior do modal */}
            <View style={styles.modalFooterButtons}>
              <View style={styles.modalBotoesContainer}>
                <BotaoAcao onPress={internarPokemon} style={styles.modalBotao} disabled={isUpdating}>
                  {isUpdating ? <ActivityIndicator /> : "Internar"}
                </BotaoAcao>
                <BotaoAcao
                  onPress={liberarPokemon}
                  style={styles.modalBotao}
                  disabled={
                    isUpdating ||
                    (
                      !historicoTexto.trim() &&
                      !medicaoSelecionada &&
                      !curativoSelecionada
                    )
                  }
                >
                  {isUpdating ? <ActivityIndicator /> : "Liberar Alta"}
                </BotaoAcao>
              </View>

              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Text style={styles.modalFechar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View> 
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: espacamento.l,
    marginBottom: espacamento.s,
  },
  voltarIcon: {
    width: 30,
    height: 30,
    tintColor: cores.textoClaro,
  },
  containerTituloHeader: {
    alignItems: 'center',
  },
  titulo: {
    ...estilosGlobais.titulo,
    marginBottom: 0,
  },
  contador: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoSecundario,
  },
  containerBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioMedio,
    paddingHorizontal: espacamento.l,
    marginHorizontal: espacamento.l,
    marginBottom: espacamento.l,
    ...sombras.sombraMedia,
  },
  campoBusca: {
    flex: 1,
    paddingVertical: espacamento.m,
    paddingLeft: espacamento.m,
    color: cores.textoClaro,
    fontFamily: tipografia.familia,
  },
  listaContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: espacamento.m,
  },
  card: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioMedio,
    padding: espacamento.l,
    ...sombras.sombraMedia,
    alignItems: 'center',
    width: 280, // Largura fixa para os cards
    margin: espacamento.s, // Margem para espaçamento
  },
  cardUrgente: {
    borderColor: cores.erro,
    borderWidth: 2,
  },
  tagUrgente: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: cores.erro,
    color: cores.branco,
    paddingHorizontal: espacamento.m,
    paddingVertical: espacamento.xs,
    borderTopRightRadius: bordas.raioMedio,
    borderBottomLeftRadius: bordas.raioMedio,
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.pequeno,
    fontWeight: tipografia.pesos.bold,
  },
  imagemCard: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: espacamento.m,
  },
  nomePokemon: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.subtitulo,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoClaro,
    marginBottom: espacamento.s,
  },
  tipoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: espacamento.s,
    marginBottom: espacamento.m,
  },
  tipoTag: {
    backgroundColor: cores.fundoEscuro,
    paddingHorizontal: espacamento.m,
    paddingVertical: espacamento.xs,
    borderRadius: bordas.raioPequeno,
  },
  tipoTexto: {
    color: cores.textoSecundario,
    fontSize: tipografia.tamanhos.pequeno,
  },
  detalheContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamento.s,
  },
  detalheCard: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoSecundario,
  },
  containerVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espacamento.m,
  },
  imagemVazio: {
    width: 320,
    height: 320,
    marginBottom: espacamento.xs,
    resizeMode: 'contain',
  },
  tituloVazio: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.subtitulo,
    color: cores.textoClaro,
    textAlign: 'center',
    marginBottom: espacamento.xs,
  },
  subtituloVazio: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
  colunaImagem: { 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundoEscuro,
    paddingVertical: espacamento.l,
  },
  modalImagem: { 
    width: '80%',
    height: 200,
    resizeMode: 'contain',
  },
  modalTitulo: { 
    textAlign: 'center',
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo,
    color: cores.textoClaro,
    marginBottom: espacamento.m, 
    paddingTop: espacamento.l, 
  },
  modalSubtitulo: { 
    textAlign: 'center',
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    color: cores.textoSecundario,
    marginBottom: espacamento.l,
  },
  modalBotoesContainer: { 
    flexDirection: 'row',
    gap: espacamento.m,
    width: '100%',
  },
  modalBotao: {
    flex: 1,
  },
  botaoFecharModal: { 
    position: 'absolute',
    top: espacamento.m,
    right: espacamento.m,
    zIndex: 1,
    padding: espacamento.s,
  },
  modalFechar: { 
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoSecundario,
    marginTop: espacamento.xl,
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingBottom: espacamento.l, 
  },
  modalHeaderContent: { 
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: espacamento.xl, 
    marginBottom: espacamento.l,
  },
  modalBodyContent: { 
    width: '100%',
    paddingHorizontal: espacamento.xl, 
  },
  modalFooterButtons: { 
    width: '100%',
    paddingTop: espacamento.l, 
    paddingHorizontal: espacamento.xl, 
    backgroundColor: cores.fundoSuperficie, 
    borderTopWidth: 1,
    borderTopColor: cores.neutra, 
    alignItems: 'center', 
  },
  opcoesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: espacamento.m,
    width: '100%',
    marginBottom: espacamento.l,
  },
  opcaoBotao: {
    backgroundColor: cores.fundoEscuro,
    paddingVertical: espacamento.s,
    paddingHorizontal: espacamento.l,
    borderRadius: bordas.raioPequeno,
    borderWidth: 1,
    borderColor: cores.neutra,
  },
  opcaoBotaoSelecionado: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  opcaoTexto: {
    color: cores.textoClaro,
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
  },
  descricaoContainer: {
    backgroundColor: cores.fundoEscuro,
    borderRadius: bordas.raioPequeno,
    padding: espacamento.m,
    marginBottom: espacamento.l,
    width: '100%',
    borderWidth: 1,
    borderColor: '#444',
  },
  descricaoLabel: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoSecundario,
    marginBottom: espacamento.s,
    textTransform: 'uppercase',
  },
  descricaoTexto: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    color: cores.textoClaro,
    fontStyle: 'italic',
  },
  fraquezasContainer: {
    backgroundColor: cores.fundoEscuro,
    borderRadius: bordas.raioPequeno,
    padding: espacamento.m,
    marginBottom: espacamento.l,
    width: '100%',
    borderWidth: 1,
    borderColor: '#444',
  },
  fraquezasLabel: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoSecundario,
    marginBottom: espacamento.s,
    textTransform: 'uppercase',
  },
  fraquezaTag: {
    backgroundColor: cores.fundoEscuro,
    paddingHorizontal: espacamento.m,
    paddingVertical: espacamento.xs,
    borderRadius: bordas.raioPequeno,
    marginRight: espacamento.s,
    marginBottom: espacamento.s,
  },
});