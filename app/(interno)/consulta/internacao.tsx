import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
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

export default function Internacao() {
  const router = useRouter();
  const [internados, setInternados] = useState<PokemonCadastro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pokemonSelecionado, setPokemonSelecionado] = useState<PokemonCadastro | null>(null);
  const [novaAtualizacao, setNovaAtualizacao] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const carregarInternados = async () => {
    setCarregando(true);
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
  
  useFocusEffect(
    useMemo(() => {
      return () => {
        carregarInternados();
      };
    }, [])
  );

  const abrirModal = (pokemon: PokemonCadastro) => {
    setPokemonSelecionado(pokemon);
    setNovaAtualizacao("");
    setModalVisivel(true);
  };

  const salvarAtualizacao = async () => {
    if (!pokemonSelecionado) return;
    if (!novaAtualizacao.trim()) {
      Alert.alert("Atenção", "Por favor, adicione uma anotação para salvar.");
      return;
    }
    
    setIsUpdating(true);
    const chave = `pokemons:${pokemonSelecionado.idTreinador}`;
    
    try {
      const dados = await AsyncStorage.getItem(chave);
      if (!dados) throw new Error("Registro do treinador não encontrado.");

      let lista: PokemonCadastro[] = JSON.parse(dados);
      const historicoAtual = pokemonSelecionado.historico || [];
      const novaEntrada: EntradaHistorico = {
        data: new Date().toLocaleString(),
        descricao: novaAtualizacao,
      };

      const novaLista = lista.map((p) => {
        if (p.nomePokemon === pokemonSelecionado.nomePokemon && p.idTreinador === pokemonSelecionado.idTreinador) {
          return { ...p, historico: [...historicoAtual, novaEntrada] };
        }
        return p;
      });
      
      await AsyncStorage.setItem(chave, JSON.stringify(novaLista));
      setPokemonSelecionado(prevState => ({ ...prevState!, historico: [...historicoAtual, novaEntrada] }));
      setNovaAtualizacao("");
      
    } catch (err) {
        Alert.alert("Erro", "Não foi possível salvar a atualização.");
    } finally {
        setIsUpdating(false);
    }
  };
  
  const liberarPokemon = async () => {
    if (!pokemonSelecionado) return;

    setIsUpdating(true);

    const finalNote = novaAtualizacao.trim() || "Recebeu alta da internação.";
    const chave = `pokemons:${pokemonSelecionado.idTreinador}`;

    try {
        const dados = await AsyncStorage.getItem(chave);
        if (!dados) throw new Error("Registro do treinador não encontrado.");

        let lista: PokemonCadastro[] = JSON.parse(dados);
        const historicoAtual = pokemonSelecionado.historico || [];
        const novaEntrada: EntradaHistorico = {
            data: new Date().toLocaleString(),
            descricao: finalNote,
        };

        const novaLista = lista.map((p) => {
            if (p.nomePokemon === pokemonSelecionado.nomePokemon && p.idTreinador === pokemonSelecionado.idTreinador) {
                return {
                    ...p,
                    internado: false,
                    finalizado: true,
                    historico: [...historicoAtual, novaEntrada]
                };
            }
            return p;
        });

        await AsyncStorage.setItem(chave, JSON.stringify(novaLista));
        await carregarInternados();
        setModalVisivel(false);

    } catch (err) {
        Alert.alert("Erro", "Não foi possível liberar o Pokémon.");
    } finally {
        setIsUpdating(false);
    }
  };

  const renderItem = ({ item, index }: { item: PokemonCadastro; index: number }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      delay={index * 100}
    >
      <TouchableOpacity onPress={() => abrirModal(item)}>
        <View style={styles.card}>
          <Image source={{ uri: item.imagem }} style={styles.imagemCard} />
          <Text style={styles.nomePokemon} numberOfLines={1}>{item.nomePokemon}</Text>
          <View style={styles.detalheContainer}>
            <Feather name="user" size={14} color={cores.textoSecundario} />
            <Text style={styles.detalheCard} numberOfLines={1}>{item.nomeTreinador || '-'}</Text>
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
          <Text style={styles.titulo}>Internação</Text>
          {!carregando && (
            <Text style={styles.contador}>
              {internados.length} pacientes internados
            </Text>
          )}
        </View>
        <View style={{ width: 30 }} />
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color={cores.primaria} style={{ flex: 1 }} />
      ) : internados.length > 0 ? (
        <FlatList
          data={internados}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.nomePokemon}-${index}`}
          contentContainerStyle={styles.listaContainer}
        />
      ) : (
        <View style={styles.containerVazio}>
          <Image source={require('../../../assets/snorlax.png')} style={styles.imagemVazio} />
          <Text style={styles.tituloVazio}>Nenhum paciente na internação</Text>
          <Text style={styles.subtituloVazio}>Os pacientes aparecerão aqui quando forem internados.</Text>
        </View>
      )}

<Modal
  visible={modalVisivel}
  transparent
  animationType="fade"
  onRequestClose={() => setModalVisivel(false)}
>
  <View style={estilosGlobais.modalFundo}>
    <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setModalVisivel(false)}>
        <Feather name="x" size={24} color={cores.textoSecundario} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: espacamento.xl }}>
        <View style={styles.colunaImagem}>
          <Image source={{ uri: pokemonSelecionado?.imagem }} style={styles.modalImagem} />
        </View>

        <View style={styles.colunaFormulario}>
          <Text style={styles.modalTitulo}>{pokemonSelecionado?.nomePokemon}</Text>

          <View style={styles.historicoContainer}>
            <Text style={styles.historicoTitulo}>Histórico Médico</Text>
            <ScrollView style={styles.historicoScroll}>
              {pokemonSelecionado?.historico?.map((entrada, index) => (
                <View key={index} style={styles.historicoItem}>
                  <Text style={styles.historicoData}>{entrada.data}</Text>
                  <Text style={styles.historicoDescricao}>{entrada.descricao}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <Text style={estilosGlobais.label}>Adicionar Nova Anotação</Text>
          <TextInput
            style={[estilosGlobais.campoMultilinha, { height: 80 }]}
            placeholder="Adicionar atualização ou nota final..."
            placeholderTextColor={cores.textoSecundario}
            value={novaAtualizacao}
            onChangeText={setNovaAtualizacao}
            multiline
          />

          <BotaoAcao
            onPress={salvarAtualizacao}
            tipo="secundario"
            style={{ marginBottom: espacamento.m }}
            disabled={isUpdating}
          >
            {isUpdating ? <ActivityIndicator color={cores.primaria} /> : "Salvar Atualização"}
          </BotaoAcao>

          <BotaoAcao
            onPress={liberarPokemon}
            tipo="primario"
            disabled={isUpdating}
          >
            {isUpdating ? <ActivityIndicator color={cores.branco} /> : "Liberar Pokémon"}
          </BotaoAcao>

          <TouchableOpacity onPress={() => setModalVisivel(false)}>
            <Text style={styles.modalFechar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginBottom: espacamento.l,
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
    width: 280,
    margin: espacamento.s,
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
    padding: espacamento.xl,
  },
  imagemVazio: {
    width: 320,
    height: 320,
    marginBottom: espacamento.m,
    resizeMode: 'contain',
  },
  tituloVazio: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.subtitulo,
    color: cores.textoClaro,
    textAlign: 'center',
    marginBottom: espacamento.s,
  },
  subtituloVazio: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
modalContainer: {
  backgroundColor: cores.fundoSuperficie,
  borderRadius: bordas.raioGrande,
  width: '90%',
  maxWidth: 600,
  maxHeight: '90%',
  alignSelf: 'center',
  overflow: 'hidden',
  ...sombras.sombraMedia,
},
  colunaFormulario: {
    width: '100%',
    padding: espacamento.l,
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
    height: 150,
    resizeMode: 'contain',
  },
  modalTitulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo,
    color: cores.textoClaro,
    textAlign: 'center',
    marginBottom: espacamento.m,
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
  },
  historicoContainer: {
    width: '100%',
    height: 150,
    backgroundColor: cores.fundoEscuro,
    borderRadius: bordas.raioPequeno,
    padding: espacamento.m,
    marginBottom: espacamento.l,
    borderWidth: 1,
    borderColor: '#444',
  },
  historicoTitulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoSecundario,
    marginBottom: espacamento.s,
    textTransform: 'uppercase',
  },
  historicoScroll: {
    flex: 1,
  },
  historicoItem: {
    marginBottom: espacamento.m,
  },
  historicoData: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.pequeno,
    color: cores.textoSecundario,
  },
  historicoDescricao: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoClaro,
  },
});