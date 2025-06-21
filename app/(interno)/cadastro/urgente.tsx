import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  estilosGlobais,
  cores,
  espacamento,
  bordas,
  sombras,
  tipografia,
} from '../../../styles/estilosGlobais';
import { salvarPokemon, PokemonCadastro } from '../../../utils/salvarPokemon';
import { buscarDadosPorEspecie, DadosPokemon } from '../../../utils/pokeapi';
import axios from 'axios';
import BotaoAcao from '../../../components/BotaoAcao';

type ErrosCadastroUrgente = Partial<
  Pick<PokemonCadastro, 'nomeTreinador' | 'especiePokemon' | 'descricao'>
>;

export default function CadastroUrgente() {
  const router = useRouter();

  const [nomeTreinador, setNomeTreinador] = useState('');
  const [especiePokemon, setEspeciePokemon] = useState('');
  const [tipoPokemon, setTipoPokemon] = useState('');
  const [imagemPokemon, setImagemPokemon] = useState('');
  const [descricao, setDescricao] = useState('');
  const [listaSugestoes, setListaSugestoes] = useState<any[]>([]);
  const [todasEspecies, setTodasEspecies] = useState<any[]>([]);
  const [modalMensagem, setModalMensagem] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cadastroSucesso, setCadastroSucesso] = useState(false);
  const [errors, setErrors] = useState<ErrosCadastroUrgente>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=2000')
      .then((res) =>
        setTodasEspecies(
          res.data.results.filter(
            (p: any) => !p.name.includes('-')
          )
        )
      )
      .catch(() => setTodasEspecies([]));
  }, []);

  const buscarEspecie = async (nome: string) => {
    setEspeciePokemon(nome);
    if (nome.length < 3) {
      setListaSugestoes([]);
      return;
    }
    const filtradas = todasEspecies
      .filter((p) => p.name.toLowerCase().includes(nome.toLowerCase()))
      .slice(0, 5);
    setListaSugestoes(filtradas);
  };

  const selecionarEspecie = async (nome: string) => {
    setEspeciePokemon(nome);
    setListaSugestoes([]);
    const dados: DadosPokemon | null = await buscarDadosPorEspecie(nome);
    if (dados) {
      setEspeciePokemon(dados.nomeEspecie);
      setTipoPokemon(dados.tipos.join(', '));
      setImagemPokemon(dados.urlImagem);
    }
  };

  const validate = () => {
    const novosErros: ErrosCadastroUrgente = {};
    if (!nomeTreinador)
      novosErros.nomeTreinador = 'O nome do treinador é obrigatório.';
    if (!especiePokemon)
      novosErros.especiePokemon = 'A espécie do Pokémon é obrigatória.';
    if (!descricao)
      novosErros.descricao = 'A descrição do caso é obrigatória.';
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const resetarFormulario = () => {
    setNomeTreinador('');
    setEspeciePokemon('');
    setTipoPokemon('');
    setImagemPokemon('');
    setDescricao('');
    setErrors({});
  };

  const salvar = async () => {
    if (!validate()) return;
    setIsSaving(true);
    const resultado = await salvarPokemon({
      nomePokemon: especiePokemon,
      tipoPokemon,
      especiePokemon,
      dataCaptura: new Date().toLocaleDateString('pt-BR'),
      foiTroca: false,
      nomeTreinador,
      idTreinador: 'urgente',
      descricao,
      imagem: imagemPokemon,
      urgente: true,
    });
    setIsSaving(false);
    if (resultado.sucesso) {
      setModalMensagem('Cadastro de urgência realizado com sucesso!');
      setCadastroSucesso(true);
      setMostrarModal(true);
    } else {
      setModalMensagem('Erro ao salvar cadastro de urgência.');
      setCadastroSucesso(false);
      setMostrarModal(true);
    }
  };

  const handleFecharModal = () => {
    setMostrarModal(false);
    if (cadastroSucesso) {
      resetarFormulario();
      router.push('/(interno)/tela-inicial');
    }
  };

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardPrincipal}>
          <TouchableOpacity
            style={styles.voltarContainer}
            onPress={() => router.back()}
          >
            <Image
              source={require('../../../assets/voltar.png')}
              style={styles.voltarIcon}
            />
          </TouchableOpacity>
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Atendimento Urgente</Text>
          </View>

          <View style={styles.colunasContainer}>
            <View style={styles.coluna}>
              <Text style={estilosGlobais.label}>Nome do Treinador *</Text>
              <TextInput
                style={[
                  estilosGlobais.campoTexto,
                  errors.nomeTreinador && styles.campoComErro,
                ]}
                value={nomeTreinador}
                onChangeText={setNomeTreinador}
                placeholderTextColor={cores.textoSecundario}
              />
              {errors.nomeTreinador && (
                <Text style={styles.textoErro}>{errors.nomeTreinador}</Text>
              )}

              <Text style={estilosGlobais.label}>Espécie do Pokémon *</Text>
              <TextInput
                style={[
                  estilosGlobais.campoTexto,
                  errors.especiePokemon && styles.campoComErro,
                ]}
                value={especiePokemon}
                onChangeText={buscarEspecie}
                placeholder="Digite para buscar"
                placeholderTextColor={cores.textoSecundario}
              />
              {errors.especiePokemon && (
                <Text style={styles.textoErro}>{errors.especiePokemon}</Text>
              )}

              {listaSugestoes.length > 0 && (
                <FlatList
                  style={styles.listaSugestoes}
                  data={listaSugestoes}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => selecionarEspecie(item.name)}
                      style={styles.sugestaoItem}
                    >
                      <Image
                        source={{
                          uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                            item.url.split('/')[6]
                          }.png`,
                        }}
                        style={styles.sugestaoImagem}
                      />
                      <Text style={styles.sugestaoTexto}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}

              <Text style={estilosGlobais.label}>Tipo(s)</Text>
              <TextInput
                style={estilosGlobais.campoTexto}
                value={tipoPokemon}
                editable={false}
              />
            </View>

            <View style={styles.coluna}>
              <Text style={estilosGlobais.label}>Descrição do Caso *</Text>
              <TextInput
                style={[
                  estilosGlobais.campoMultilinha,
                  styles.campoDescricao,
                  errors.descricao && styles.campoComErro,
                ]}
                multiline
                value={descricao}
                onChangeText={setDescricao}
                placeholderTextColor={cores.textoSecundario}
              />
              {errors.descricao && (
                <Text style={styles.textoErro}>{errors.descricao}</Text>
              )}
            </View>
          </View>

          <BotaoAcao
            onPress={salvar}
            style={{ marginTop: espacamento.l, width: '100%' }}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={cores.branco} />
            ) : (
              'Salvar Atendimento'
            )}
          </BotaoAcao>
        </View>
      </ScrollView>

      <Modal
        visible={mostrarModal}
        transparent
        animationType="fade"
        onRequestClose={handleFecharModal}
      >
        <View style={estilosGlobais.modalFundo}>
          <View style={estilosGlobais.modalConteudo}>
            {cadastroSucesso && (
              <Image
                source={require('../../../assets/sucesso.png')}
                style={styles.modalImagem}
              />
            )}
            <Text style={estilosGlobais.modalTexto}>{modalMensagem}</Text>
            <TouchableOpacity onPress={handleFecharModal}>
              <Text style={styles.modalFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: espacamento.xl,
  },
  cardPrincipal: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioGrande,
    padding: espacamento.xl,
    width: '100%',
    maxWidth: 900,
    ...sombras.sombraMedia,
  },
  voltarContainer: {
    alignSelf: 'flex-start',
    position: 'absolute',
    top: espacamento.l,
    left: espacamento.l,
    zIndex: 1,
  },
  voltarIcon: {
    width: 30,
    height: 30,
    tintColor: cores.textoSecundario,
  },
  tituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacamento.xl,
  },
  titulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo,
    color: cores.textoClaro,
    textAlign: 'center',
  },
  urgenteIcon: {
    width: 30,
    height: 30,
    marginLeft: espacamento.m,
  },
  colunasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacamento.xl,
  },
  coluna: {
    flex: 1,
    minWidth: 300,
  },
  campoDescricao: {
    height: 220,
  },
  listaSugestoes: {
    backgroundColor: '#3c3c3e',
    borderRadius: bordas.raioPequeno,
    marginTop: -espacamento.l,
    marginBottom: espacamento.l,
    maxHeight: 180,
  },
  sugestaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: espacamento.m,
    borderBottomWidth: 1,
    borderBottomColor: cores.fundoSuperficie,
  },
  sugestaoImagem: {
    width: 40,
    height: 40,
    marginRight: espacamento.m,
  },
  sugestaoTexto: {
    color: cores.textoClaro,
    fontSize: tipografia.tamanhos.corpo,
  },
  campoComErro: {
    borderColor: cores.erro,
    borderWidth: 1,
  },
  textoErro: {
    color: cores.erro,
    fontSize: tipografia.tamanhos.pequeno,
    marginTop: -espacamento.l + 4,
    marginBottom: espacamento.m,
    fontWeight: 'bold',
  },
  modalImagem: {
    width: 80,
    height: 80,
    marginBottom: espacamento.l,
  },
  modalFechar: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.primaria,
    marginTop: espacamento.m,
    textDecorationLine: 'underline',
  },
});