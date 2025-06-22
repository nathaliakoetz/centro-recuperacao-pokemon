import { useEffect, useState, useMemo } from "react";
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

export default function ListaEspera() {
  const [pokemons, setPokemons] = useState<PokemonCadastro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pokemonNome, setPokemonNome] = useState<string | undefined>();
  const [termoBusca, setTermoBusca] = useState('');

  const router = useRouter();

  const carregarPokemons = async () => {
    setCarregando(true);
    try {
      const todasChaves = await AsyncStorage.getAllKeys();
      const chavesPokemons = todasChaves.filter((chave) =>
        chave.startsWith("pokemons:")
      );
      const resultados = await AsyncStorage.multiGet(chavesPokemons);
      const lista: PokemonCadastro[] = resultados.flatMap(([, valor]) =>
        JSON.parse(valor || "[]")
      );

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

  useEffect(() => {
    carregarPokemons();
  }, []);

  const enviarParaConsulta = async (pokemon: PokemonCadastro) => {
    const chave = `pokemons:${pokemon.idTreinador}`;
    const dados = await AsyncStorage.getItem(chave);
    if (!dados) return;

    const lista: PokemonCadastro[] = JSON.parse(dados);
    const novaLista = lista.map((p) =>
      p.nomePokemon === pokemon.nomePokemon ? { ...p, emConsulta: true } : p
    );

    await AsyncStorage.setItem(chave, JSON.stringify(novaLista));

    await carregarPokemons();

    setPokemonNome(pokemon.nomePokemon);
    setModalVisivel(true);
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
      <View style={[styles.card, item.urgente && styles.cardUrgente]}>
        {item.urgente && <Text style={styles.tagUrgente}>URGENTE</Text>}
        <Image source={{ uri: item.imagem }} style={styles.imagemCard} />
        <Text style={styles.nomePokemon} numberOfLines={1}>
          {item.nomePokemon}
        </Text>

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

        <BotaoAcao
          onPress={() => enviarParaConsulta(item)}
          style={styles.botaoCard}
        >
          Iniciar Consulta
        </BotaoAcao>
      </View>
    </Animatable.View>
  );

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(interno)/medico/medico')}>
          <Image source={require('../../../assets/voltar.png')} style={styles.voltarIcon} />
        </TouchableOpacity>
        <View style={styles.containerTituloHeader}>
          <Text style={styles.titulo}>Fila de Espera</Text>
          {!carregando && (
            <Text style={styles.contador}>
              {pokemonsFiltrados.length} pacientes na fila
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
        <ActivityIndicator
          size="large"
          color={cores.primaria}
          style={{ flex: 1 }}
        />
      ) : pokemonsFiltrados.length > 0 ? (
        <FlatList
          data={pokemonsFiltrados}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.nomePokemon}-${index}`}
          contentContainerStyle={styles.lista}
        />
      ) : (
        <View style={styles.containerVazio}>
          <Image
            source={require('../../../assets/sucesso.png')}
            style={styles.imagemVazio}
          />
          <Text style={styles.tituloVazio}>
            {termoBusca
              ? 'Nenhum resultado encontrado'
              : 'Nenhum paciente aguardando'}
          </Text>
          <Text style={styles.subtituloVazio}>
            {termoBusca
              ? `Tente uma busca diferente.`
              : 'A fila de espera está vazia no momento.'}
          </Text>
        </View>
      )}

      <Modal transparent visible={modalVisivel} animationType="fade">
        <View style={estilosGlobais.modalFundo}>
          <View style={estilosGlobais.modalConteudo}>
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginBottom: 0, marginRight: 8 }}
              onPress={() => setModalVisivel(false)}>
              <Feather name="x" size={24} color={cores.textoSecundario} />
            </TouchableOpacity>
            <Text style={estilosGlobais.modalTitulo}>Sucesso!</Text>
            <Text style={estilosGlobais.modalTexto}>
              O Pokémon <Text style={{ fontWeight: 'bold' }}>{pokemonNome}</Text>{' '}
              foi enviado para a consulta.
            </Text>
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
  lista: {
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
    margin: espacamento.s,
    width: 280,
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
  botaoCard: {
    marginTop: espacamento.s,
    width: '100%',
  },
  containerVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espacamento.xs,
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
  modalImagem: {
    width: 80,
    height: 80,
    marginBottom: espacamento.xs,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  modalFechar: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.primaria,
    padding: espacamento.s,
  },
});