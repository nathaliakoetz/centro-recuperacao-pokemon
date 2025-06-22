import { View, Text, TextInput, Switch, ScrollView, Image, TouchableOpacity, FlatList, StyleSheet, Modal, Platform, ActivityIndicator, Alert, } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { estilosGlobais, cores, espacamento, bordas, sombras, tipografia, } from '../../../styles/estilosGlobais';
import { salvarPokemon, PokemonCadastro } from '../../../utils/salvarPokemon';
import { buscarDadosPorEspecie, DadosPokemon } from '../../../utils/pokeapi';
import axios from 'axios';
import BotaoAcao from '../../../components/BotaoAcao';

type ErrosCadastro = Partial<
  Record<keyof Omit<PokemonCadastro, 'foiTroca' | 'urgente'>, string>
>;

export default function Cadastro() {
  const router = useRouter();

  const [idTreinador, setIdTreinador] = useState('');
  const [nomeTreinador, setNomeTreinador] = useState('');
  const [idVerificado, setIdVerificado] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [treinadorEncontrado, setTreinadorEncontrado] = useState(false);
  const [usarNomePersonalizado, setUsarNomePersonalizado] = useState(false);
  const [nomePersonalizado, setNomePersonalizado] = useState('');
  const [especiePokemon, setEspeciePokemon] = useState('');
  const [tipoPokemon, setTipoPokemon] = useState('');
  const [imagemPokemon, setImagemPokemon] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [foiTroca, setFoiTroca] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [listaSugestoes, setListaSugestoes] = useState<any[]>([]);
  const [todasEspecies, setTodasEspecies] = useState<any[]>([]);
  const [modalMensagem, setModalMensagem] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cadastroSucesso, setCadastroSucesso] = useState(false);
  const [errors, setErrors] = useState<ErrosCadastro>({});
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

  const handleVerificarId = async () => {
    if (!idTreinador.trim()) {
      Alert.alert('Atenção', 'Por favor, digite um ID de treinador.');
      return;
    }
    setIsVerifying(true);
    try {
      const dados = await AsyncStorage.getItem(`pokemons:${idTreinador}`);
      if (dados) {
        const pokemons: PokemonCadastro[] = JSON.parse(dados);
        if (pokemons.length > 0 && pokemons[0].nomeTreinador) {
          setNomeTreinador(pokemons[0].nomeTreinador);
          setTreinadorEncontrado(true);
        }
      } else {
        setNomeTreinador('');
        setTreinadorEncontrado(false);
      }
      setIdVerificado(true);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível verificar o ID.');
    } finally {
      setIsVerifying(false);
    }
  };

  const resetarFormularioCompleto = () => {
    setIdVerificado(false); setIdTreinador(''); setNomeTreinador(''); setTreinadorEncontrado(false); setEspeciePokemon(''); setTipoPokemon(''); setImagemPokemon(''); setDia(''); setMes(''); setAno(''); setNomePersonalizado(''); setDescricao(''); setErrors({});
  };

  const buscarEspecie = async (nome: string) => {
    setEspeciePokemon(nome);
    if (nome.length < 3) { setListaSugestoes([]); return; }
    const filtradas = todasEspecies.filter((p) => p.name.toLowerCase().includes(nome.toLowerCase())).slice(0, 5);
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
    const novosErros: ErrosCadastro = {};
    const nomeFinal = usarNomePersonalizado ? nomePersonalizado : especiePokemon;
    if (!nomeFinal) novosErros.nomePokemon = 'O nome ou espécie é obrigatório.';
    if (!especiePokemon) novosErros.especiePokemon = 'A espécie é obrigatória.';
    if (!dia || !mes || !ano || ano.length < 4) novosErros.dataCaptura = 'A data é obrigatória e o ano deve ter 4 dígitos.';
    if (!idTreinador) novosErros.idTreinador = 'O ID do treinador é obrigatório.';
    if (!nomeTreinador && !treinadorEncontrado) novosErros.nomeTreinador = 'O nome do treinador é obrigatório.'
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvar = async () => {
    if (!validate()) return;
    setIsSaving(true);
    const nomeFinal = usarNomePersonalizado ? nomePersonalizado : especiePokemon;
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const resultado = await salvarPokemon({
      nomePokemon: nomeFinal, tipoPokemon, especiePokemon, dataCaptura: dataFormatada, foiTroca, nomeTreinador, idTreinador, descricao, imagem: imagemPokemon,
    });
    setIsSaving(false);
    if (resultado.sucesso) {
      setModalMensagem('Pokémon cadastrado com sucesso!');
      setCadastroSucesso(true);
      setMostrarModal(true);
    } else {
      setModalMensagem('Erro ao salvar cadastro.');
      setCadastroSucesso(false);
      setMostrarModal(true);
    }
  };

  const handleFecharModal = () => {
    setMostrarModal(false);
    if (cadastroSucesso) {
      resetarFormularioCompleto();
      router.push('/(interno)/tela-inicial');
    }
  };

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardPrincipal}>
          <TouchableOpacity style={styles.voltarContainer} onPress={() => idVerificado ? resetarFormularioCompleto() : router.back()} >
            <Image source={require('../../../assets/voltar.png')} style={styles.voltarIcon} />
          </TouchableOpacity>
          <Text style={styles.titulo}>Ficha de Cadastro do Paciente</Text>

          {!idVerificado ? (
            <View style={styles.etapaVerificacao}>
              <Text style={estilosGlobais.label}>Primeiro, informe o ID do Treinador *</Text>
              <TextInput style={estilosGlobais.campoTexto} value={idTreinador} onChangeText={setIdTreinador} placeholder="Digite o ID do treinador" placeholderTextColor={cores.textoSecundario} />
              <BotaoAcao onPress={handleVerificarId} disabled={isVerifying}>
                {isVerifying ? <ActivityIndicator color={cores.branco} /> : 'Verificar ID'}
              </BotaoAcao>
            </View>
          ) : (
            <>
              <View style={styles.colunasContainer}>
                <View style={styles.coluna}>
                  <Text style={estilosGlobais.label}>ID do Treinador</Text>
                  <View style={styles.campoComLink}>
                    <TextInput style={[estilosGlobais.campoTexto, { flex: 1 }]} value={idTreinador} editable={false} />
                    <TouchableOpacity onPress={resetarFormularioCompleto}>
                      <Text style={styles.linkTrocarId}>Trocar</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={estilosGlobais.label}>Nome do Treinador *</Text>
                  <TextInput style={[estilosGlobais.campoTexto, errors.nomeTreinador && styles.campoComErro]} value={nomeTreinador} onChangeText={setNomeTreinador} placeholder="Nome do novo treinador" placeholderTextColor={cores.textoSecundario} editable={!treinadorEncontrado} />
                  {errors.nomeTreinador && <Text style={styles.textoErro}>{errors.nomeTreinador}</Text>}

                  <Text style={estilosGlobais.label}>Data de Captura *</Text>
                  <View style={styles.dateInputContainer}>
                    <TextInput style={[styles.dateInput, errors.dataCaptura && styles.campoComErro]} placeholder="DD" value={dia} onChangeText={(t) => setDia(t.replace(/\D/g, ''))} keyboardType="numeric" maxLength={2} />
                    <TextInput style={[styles.dateInput, errors.dataCaptura && styles.campoComErro]} placeholder="MM" value={mes} onChangeText={(t) => setMes(t.replace(/\D/g, ''))} keyboardType="numeric" maxLength={2} />
                    <TextInput style={[styles.dateInput, { flex: 1.5 }, errors.dataCaptura && styles.campoComErro]} placeholder="AAAA" value={ano} onChangeText={(t) => setAno(t.replace(/\D/g, ''))} keyboardType="numeric" maxLength={4} />
                  </View>
                  {errors.dataCaptura && <Text style={styles.textoErro}>{errors.dataCaptura}</Text>}

                  <View style={styles.switchContainer}>
                    <Text style={estilosGlobais.label}>Adquirido por troca?</Text>
                    <Switch value={foiTroca} onValueChange={setFoiTroca} trackColor={{ false: cores.textoSecundario, true: cores.primaria }} thumbColor={cores.branco} />
                  </View>
                </View>

                <View style={styles.coluna}>
                  <View style={styles.pokemonInfoContainer}>
                    <View style={styles.pokemonInfoCampos}>
                      <Text style={estilosGlobais.label}>Espécie do Pokémon *</Text>
                      <TextInput style={[estilosGlobais.campoTexto, errors.especiePokemon && styles.campoComErro]} value={especiePokemon} onChangeText={buscarEspecie} placeholder="Digite o nome para buscar" placeholderTextColor={cores.textoSecundario} />
                      {errors.especiePokemon && <Text style={styles.textoErro}>{errors.especiePokemon}</Text>}

                      {listaSugestoes.length > 0 && (<FlatList style={styles.listaSugestoes} data={listaSugestoes} keyExtractor={(item) => item.name} renderItem={({ item }) => (<TouchableOpacity onPress={() => selecionarEspecie(item.name)} style={styles.sugestaoItem}><Image source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.url.split("/")[6]}.png` }} style={styles.sugestaoImagem} /><Text style={styles.sugestaoTexto}>{item.name}</Text></TouchableOpacity>)} />)}

                      <Text style={estilosGlobais.label}>Tipo(s)</Text>
                      <TextInput style={estilosGlobais.campoTexto} value={tipoPokemon} editable={false} />
                    </View>
                    {imagemPokemon ? (<Image source={{ uri: imagemPokemon }} style={styles.imagemPokemon} />) : <View style={styles.imagemPokemon} />}
                  </View>

                  <View style={styles.switchContainer}>
                    <Text style={estilosGlobais.label}>Possui nome personalizado?</Text>
                    <Switch value={usarNomePersonalizado} onValueChange={setUsarNomePersonalizado} trackColor={{ false: cores.textoSecundario, true: cores.primaria }} thumbColor={cores.branco} />
                  </View>

                  {usarNomePersonalizado && (<>
                    <Text style={estilosGlobais.label}>Nome do Pokémon *</Text>
                    <TextInput style={[estilosGlobais.campoTexto, errors.nomePokemon && styles.campoComErro]} value={nomePersonalizado} onChangeText={setNomePersonalizado} placeholder="Ex: Pikachu, Charmander" placeholderTextColor={cores.textoSecundario} />
                    {errors.nomePokemon && (<Text style={styles.textoErro}>{errors.nomePokemon}</Text>)}
                  </>)}
                </View>
              </View>
              <Text style={estilosGlobais.label}>Descrição</Text>
              <TextInput style={estilosGlobais.campoMultilinha} multiline value={descricao} onChangeText={setDescricao} placeholderTextColor={cores.textoSecundario} />
              <BotaoAcao onPress={salvar} style={{ marginTop: espacamento.l, width: '100%' }} disabled={isSaving}>
                {isSaving ? <ActivityIndicator color={cores.branco} /> : 'Salvar Cadastro'}
              </BotaoAcao>
            </>
          )}
        </View>
      </ScrollView>

      <Modal visible={mostrarModal} transparent animationType="fade" onRequestClose={handleFecharModal}>
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
    maxWidth: 1000,
    ...sombras.sombraMedia,
  },
  voltarContainer: {
    alignSelf: 'flex-start',
    marginBottom: espacamento.m,
  },
  voltarIcon: {
    width: 30,
    height: 30,
    tintColor: cores.textoSecundario,
  },
  imagemCabecalho: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: espacamento.m,
  },
  titulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo,
    color: cores.textoClaro,
    textAlign: 'center',
    marginBottom: espacamento.xl,
  },
  etapaVerificacao: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'center',
  },
  imagemEtapa: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: espacamento.xl,
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
  pokemonInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espacamento.l,
  },
  pokemonInfoCampos: {
    flex: 1,
  },
  imagemPokemon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    backgroundColor: cores.fundoEscuro,
    borderRadius: bordas.raioPequeno,
    marginTop: espacamento.l * 2,
  },
  campoComLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamento.m,
  },
  linkTrocarId: {
    color: cores.primaria,
    textDecorationLine: 'underline',
    fontFamily: tipografia.familia,
  },
  listaSugestoes: {
    backgroundColor: '#3c3c3e',
    borderRadius: bordas.raioPequeno,
    marginTop: -espacamento.l,
    marginBottom: espacamento.l,
    maxHeight: 180,
    zIndex: 10,
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espacamento.l,
    marginTop: espacamento.m,
    backgroundColor: cores.fundoEscuro,
    paddingHorizontal: espacamento.m,
    paddingVertical: espacamento.s,
    borderRadius: bordas.raioPequeno,
  },
  dateInputContainer: {
    flexDirection: 'row',
    gap: espacamento.m,
    marginBottom: espacamento.l,
  },
  dateInput: {
    ...estilosGlobais.campoTexto,
    textAlign: 'center',
    width: 60,
    marginBottom: 0,
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
    marginLeft: espacamento.s,
  },
  modalImagem: {
    width: 100,
    height: 100,
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