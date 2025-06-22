import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, FlatList, TouchableOpacity, Alert, ScrollView, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { estilosGlobais, cores, espacamento, bordas, sombras, tipografia } from '../../../styles/estilosGlobais';
import BotaoAcao from '../../../components/BotaoAcao';
import { PokemonCadastro } from '../../../utils/salvarPokemon';
import * as Animatable from 'react-native-animatable';
import { Feather } from '@expo/vector-icons';

export default function BuscarID() {
  const router = useRouter();
  const [idTreinador, setIdTreinador] = useState("");
  const [pokemons, setPokemons] = useState<PokemonCadastro[]>([]);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  
  // Estados para o novo modal
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pokemonSelecionado, setPokemonSelecionado] = useState<PokemonCadastro | null>(null);
  const [novaDescricao, setNovaDescricao] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const buscarCadastro = async () => {
    if (!idTreinador.trim()) {
      Alert.alert("Atenção", "Digite o ID do treinador.");
      return;
    }
    try {
      const dados = await AsyncStorage.getItem(`pokemons:${idTreinador}`);
      const pokemonsDoTreinador = dados ? JSON.parse(dados) : [];
      // Filtra para mostrar apenas pokémons que não estão em consulta ou internação
      setPokemons(pokemonsDoTreinador.filter((p: PokemonCadastro) => !p.emConsulta && !p.internado));
    } catch (err) {
      Alert.alert("Erro", "Falha ao buscar os dados.");
      setPokemons([]);
    } finally {
      setBuscaRealizada(true);
    }
  };
  
  const abrirModalCheckin = (pokemon: PokemonCadastro) => {
    setPokemonSelecionado(pokemon);
    setNovaDescricao('');
    setModalVisivel(true);
  };
  
  const handleSalvarCheckin = async () => {
    if (!pokemonSelecionado || !novaDescricao.trim()) {
      Alert.alert("Atenção!", "A descrição do novo caso é obrigatória.");
      return;
    }

    setIsSaving(true);
    const chave = `pokemons:${pokemonSelecionado.idTreinador}`;

    try {
      const dados = await AsyncStorage.getItem(chave);
      if (!dados) throw new Error("Registro do treinador não encontrado.");

      let lista: PokemonCadastro[] = JSON.parse(dados);
      
      const novaLista = lista.map(p => {
        if (p.nomePokemon === pokemonSelecionado.nomePokemon) {
          return {
            ...p,
            emConsulta: false, // Envia para a fila de espera
            finalizado: false,
            internado: false,
            descricao: novaDescricao, // Atualiza a descrição para o novo caso
            historico: [...(p.historico || []), {
              data: new Date().toLocaleString(),
              descricao: `Check-in para nova consulta: ${novaDescricao}`
            }]
          };
        }
        return p;
      });

      await AsyncStorage.setItem(chave, JSON.stringify(novaLista));
      setModalVisivel(false);
      router.replace('/(interno)/tela-inicial');
      
    } catch (err) {
      Alert.alert("Erro", "Não foi possível realizar o check-in do Pokémon.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderItem = ({ item, index }: { item: PokemonCadastro; index: number }) => (
    <Animatable.View animation="fadeInUp" duration={500} delay={index * 100}>
        <TouchableOpacity onPress={() => abrirModalCheckin(item)} style={styles.card}>
            <Image source={{ uri: item.imagem }} style={styles.imagemCard} />
            <Text style={styles.nomePokemon} numberOfLines={1}>{item.nomePokemon}</Text>
        </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardPrincipal}>
          <TouchableOpacity style={styles.voltarContainer} onPress={() => router.back()}>
            <Image source={require('../../../assets/voltar.png')} style={styles.voltarIcon} />
          </TouchableOpacity>

          <Image source={require('../../../assets/id.png')} style={styles.imagemPrincipal} />

          <Text style={styles.titulo}>Buscar por ID do Treinador</Text>
          
          <View style={styles.formContainer}>
            <TextInput
              style={styles.campoBusca}
              placeholder="Digite o ID do treinador..."
              placeholderTextColor={cores.textoSecundario}
              value={idTreinador}
              onChangeText={setIdTreinador}
            />
            <BotaoAcao onPress={buscarCadastro} style={styles.botaoBusca}>
              Buscar
            </BotaoAcao>
          </View>
        </View>
        
        {buscaRealizada && pokemons.length > 0 && (
            <Text style={styles.subtitulo}>Selecione o Pokémon para um novo atendimento:</Text>
        )}

        {buscaRealizada && pokemons.length === 0 && (
          <Text style={styles.textoResultado}>Não há Pokémons disponíveis para este treinador.</Text>
        )}

        <FlatList
          style={styles.listaResultados}
          contentContainerStyle={styles.listaContainer}
          data={pokemons}
          keyExtractor={(item, index) => item.nomePokemon + index}
          renderItem={renderItem}
        />
      </ScrollView>

       {/* Modal para Novo Atendimento */}
      <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={() => setModalVisivel(false)}>
        <View style={estilosGlobais.modalFundo}>
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setModalVisivel(false)}>
                    <Feather name="x" size={24} color={cores.textoSecundario} />
                </TouchableOpacity>
                <Text style={styles.modalTitulo}>Novo Atendimento</Text>
                <Image source={{ uri: pokemonSelecionado?.imagem }} style={styles.modalPokemonImage} /> {/* Adicionado: Imagem do Pokémon */}
                <Text style={styles.modalSubtitulo}>{pokemonSelecionado?.nomePokemon}</Text>
                <Text style={estilosGlobais.label}>Qual o motivo da nova consulta? *</Text>
                <TextInput
                    style={estilosGlobais.campoMultilinha}
                    placeholder="Descrição do novo caso..."
                    placeholderTextColor={cores.textoSecundario}
                    value={novaDescricao}
                    onChangeText={setNovaDescricao}
                    multiline
                />
                <BotaoAcao onPress={handleSalvarCheckin} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator color={cores.branco}/> : 'Salvar e Enviar para Fila'}
                </BotaoAcao>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
    maxWidth: 900,
    alignItems: 'center',
    padding: espacamento.l,
  },
  cardPrincipal: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioGrande,
    padding: espacamento.xl,
    alignItems: 'center',
    width: '100%',
    ...sombras.sombraMedia,
    marginBottom: espacamento.xl,
  },
  voltarContainer: {
    alignSelf: 'flex-start',
    position: 'absolute',
    top: espacamento.l,
    left: espacamento.l,
  },
  voltarIcon: {
    width: 30,
    height: 30,
    tintColor: cores.textoSecundario,
  },
  imagemPrincipal: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: espacamento.l,
  },
  titulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo,
    color: cores.textoClaro,
    textAlign: 'center',
    marginBottom: espacamento.l,
  },
  subtitulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    color: cores.textoSecundario,
    marginBottom: espacamento.l,
  },
  formContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: espacamento.m,
  },
  campoBusca: {
    ...estilosGlobais.campoTexto,
    flex: 1,
    marginBottom: 0,
  },
  botaoBusca: {
    paddingHorizontal: espacamento.l,
  },
  listaResultados: {
    width: '100%',
  },
  listaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: espacamento.m,
  },
  card: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioMedio,
    padding: espacamento.l,
    ...sombras.sombraMedia,
    alignItems: 'center',
    width: 200,
  },
  imagemCard: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: espacamento.s,
  },
  nomePokemon: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    fontWeight: tipografia.pesos.bold,
    color: cores.textoClaro,
    textAlign: 'center',
  },
  textoResultado: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginVertical: espacamento.xl,
  },
// Estilos do Modal
  modalContainer: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioGrande,
    padding: espacamento.xl,
    width: '90%',
    maxWidth: 500,
    maxHeight: '85%', // Altura máxima ajustada
    alignItems: 'center',
  },
  botaoFecharModal: {
    position: 'absolute',
    top: espacamento.m,
    right: espacamento.m,
    zIndex: 1,
  },
  modalTitulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo,
    color: cores.textoClaro,
    marginBottom: espacamento.xs,
  },
  modalPokemonImage: { // Novo estilo para a imagem do modal
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: espacamento.m,
  },
  modalSubtitulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.subtitulo, // Subtítulo maior
    color: cores.primaria,
    marginBottom: espacamento.xl,
    textAlign: 'center',
  }
});