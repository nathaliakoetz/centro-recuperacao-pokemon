import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Image, Dimensions, Switch, Alert, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { estilosGlobais, cores, tipografia, espacamento, bordas, sombras } from "../styles/estilosGlobais";
import BotaoAcao from "../components/BotaoAcao";
import { salvarNovoUsuario, buscarUsuarios, Usuario } from "../utils/gerenciarUsuarios";
import { Feather } from "@expo/vector-icons";

export default function CadastrarUsuario() {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isMedico, setIsMedico] = useState(false);
  const [larguraTela, setLarguraTela] = useState(Dimensions.get('window').width);
  const [feedbackModalVisivel, setFeedbackModalVisivel] = useState(false);
  const [modalMensagem, setModalMensagem] = useState('');
  const [cadastroSucesso, setCadastroSucesso] = useState(false);
  const [authModalVisivel, setAuthModalVisivel] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [listaUsuariosModalVisivel, setListaUsuariosModalVisivel] = useState(false);
  const [listaDeUsuarios, setListaDeUsuarios] = useState<Usuario[]>([]);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);

  useEffect(() => {
    const aoMudar = () => setLarguraTela(Dimensions.get('window').width);
    const subscription = Dimensions.addEventListener('change', aoMudar);
    return () => subscription?.remove();
  }, []);
  
  const resetarFormularioCadastro = () => {
    setUsername('');
    setPassword('');
    setIsMedico(false);
  };

  const handleSalvar = async () => {
    const role = isMedico ? 'medico' : 'funcionario';
    const resultado = await salvarNovoUsuario({ username, password, role });
    setModalMensagem(resultado.mensagem);
    setCadastroSucesso(resultado.sucesso);
    setFeedbackModalVisivel(true);
    if(resultado.sucesso) {
      resetarFormularioCadastro();
    }
  };

  const handleFecharModalFeedback = () => {
    setFeedbackModalVisivel(false);
  }

  const handleAbrirAtualizacao = () => {
    setAdminUser('');
    setAdminPass('');
    setAuthModalVisivel(true);
  };

  const handleVerificarAdmin = async () => {
    if (adminUser.toLowerCase() === 'admin' && adminPass === '1234') {
      setAuthModalVisivel(false);
      setListaUsuariosModalVisivel(true);
      setCarregandoUsuarios(true);
      try {
        const usuarios = await buscarUsuarios();
        setListaDeUsuarios(usuarios);
      } finally {
        setCarregandoUsuarios(false);
      }
    } else {
      setAuthModalVisivel(false);
      setModalMensagem("Acesso Negado. Credenciais do admin principal estão incorretas.");
      setCadastroSucesso(false);
      setFeedbackModalVisivel(true);
    }
  };
  
  const handleSelecionarUsuarioParaEditar = (usuario: Usuario) => {
    setListaUsuariosModalVisivel(false);
    router.push({ 
        pathname: '/(interno)/admin/editar-usuario', 
        params: { username: usuario.username }
    });
  };

  const eTelaLarga = larguraTela >= 768;

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={[styles.cadastroContainer, { flexDirection: eTelaLarga ? 'row' : 'column' }]}>
        <View style={styles.colunaEsquerda}>
          <TouchableOpacity style={styles.voltarContainer} onPress={() => router.back()}>
            <Image source={require('../assets/voltar.png')} style={styles.voltarIcon} />
          </TouchableOpacity>
          <View style={styles.tituloContainer}>
              <Text style={styles.tituloPrincipal}>Cadastrar Novo Usuário</Text>
          </View>
          <Text style={estilosGlobais.label}>Nome de Usuário</Text>
          <TextInput
            style={estilosGlobais.campoTexto}
            placeholder="Novo usuário"
            placeholderTextColor={cores.textoSecundario}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Text style={estilosGlobais.label}>Senha</Text>
          <TextInput
            style={estilosGlobais.campoTexto}
            placeholder="Nova senha"
            placeholderTextColor={cores.textoSecundario}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.switchContainer}>
            <Text style={estilosGlobais.label}>Tipo: {isMedico ? 'Médico' : 'Funcionário'}</Text>
            <Switch
              value={isMedico}
              onValueChange={setIsMedico}
              trackColor={{ false: cores.textoSecundario, true: cores.primaria }}
              thumbColor={cores.branco}
            />
          </View>
          <View style={styles.botoesAcaoContainer}>
            <BotaoAcao onPress={handleSalvar} style={{flex: 1}}>Cadastrar</BotaoAcao>
            <BotaoAcao onPress={handleAbrirAtualizacao} tipo="secundario" style={{flex: 1}}>Atualizar</BotaoAcao>
          </View>
        </View>
        <View style={styles.colunaDireita}>
          <Image
            source={require('../assets/usuario.png')}
            style={styles.imagemPrincipal}
          />
        </View>
      </View>

      <Modal visible={feedbackModalVisivel} transparent animationType="fade" onRequestClose={handleFecharModalFeedback}>
        <View style={estilosGlobais.modalFundo}>
          <View style={[estilosGlobais.modalConteudo, {padding: espacamento.xl}]}>
            <TouchableOpacity style={styles.botaoFecharModal} onPress={handleFecharModalFeedback}>
              <Feather name="x" size={24} color={cores.textoSecundario} />
            </TouchableOpacity>
            <Text style={estilosGlobais.modalTitulo}>{cadastroSucesso ? '' : 'Atenção'}</Text>
            {cadastroSucesso && <Image source={require('../assets/sucesso.png')} style={styles.modalImagem} />}
            <Text style={estilosGlobais.modalTexto}>{modalMensagem}</Text>
            <TouchableOpacity onPress={handleFecharModalFeedback} style={estilosGlobais.botaoBase}>
                <Text style={estilosGlobais.textoBotao}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={authModalVisivel} transparent animationType="fade" onRequestClose={() => setAuthModalVisivel(false)}>
        <View style={estilosGlobais.modalFundo}>
            <View style={[estilosGlobais.modalConteudo, styles.modalAuth]}>
                <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setAuthModalVisivel(false)}>
                    <Feather name="x" size={24} color={cores.textoSecundario} />
                </TouchableOpacity>
                <Text style={estilosGlobais.modalTitulo}>Verificação de Admin</Text>
                <Text style={estilosGlobais.modalTexto}>Digite as credenciais do admin principal para continuar.</Text>
                <TextInput style={estilosGlobais.campoTexto} placeholder="Usuário (admin)" value={adminUser} onChangeText={setAdminUser} autoCapitalize="none" />
                <TextInput style={estilosGlobais.campoTexto} placeholder="Senha" value={adminPass} onChangeText={setAdminPass} secureTextEntry />
                <BotaoAcao onPress={handleVerificarAdmin}>Verificar</BotaoAcao>
            </View>
        </View>
      </Modal>

      <Modal visible={listaUsuariosModalVisivel} transparent animationType="fade" onRequestClose={() => setListaUsuariosModalVisivel(false)}>
        <View style={estilosGlobais.modalFundo}>
            <View style={[estilosGlobais.modalConteudo, { paddingBottom: espacamento.xl, paddingHorizontal: espacamento.l }]}>
                <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setListaUsuariosModalVisivel(false)}>
                    <Feather name="x" size={24} color={cores.textoSecundario} />
                </TouchableOpacity>
                <Text style={[estilosGlobais.modalTitulo, {marginBottom: espacamento.l}]}>Selecione um Usuário para Editar</Text>
                {carregandoUsuarios ? <ActivityIndicator size="large" color={cores.primaria} /> : (
                    <FlatList
                        data={listaDeUsuarios}
                        keyExtractor={(item) => item.username}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.itemUsuario} onPress={() => handleSelecionarUsuarioParaEditar(item)}>
                                <Text style={styles.nomeUsuario}>{item.username}</Text>
                                <Text style={styles.roleUsuario}>{item.role}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={<Text style={estilosGlobais.textoSecundario}>Nenhum usuário cadastrado.</Text>}
                    />
                )}
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cadastroContainer: { width: '100%', maxWidth: 900, padding: espacamento.xl, backgroundColor: cores.fundoSuperficie, borderRadius: bordas.raioGrande, ...sombras.sombraMedia },
  colunaEsquerda: { flex: 1, justifyContent: 'center', paddingRight: espacamento.m },
  colunaDireita: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: espacamento.m },
  voltarContainer: { marginBottom: espacamento.l, alignSelf: 'flex-start' },
  voltarIcon: { width: 30, height: 30, tintColor: cores.textoSecundario },
  tituloContainer: { marginBottom: espacamento.xl, paddingTop: espacamento.xl },
  tituloPrincipal: { fontFamily: tipografia.familia, fontSize: 40, color: cores.textoClaro, textAlign: 'center' },
  imagemPrincipal: { width: '100%', height: 300, resizeMode: 'contain' },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: espacamento.l, padding: espacamento.s, backgroundColor: cores.fundoEscuro, borderRadius: bordas.raioPequeno },
  botoesAcaoContainer: { flexDirection: 'row', gap: espacamento.m },
  modalImagem: { width: 80, height: 80, marginBottom: espacamento.m, alignSelf: 'center', resizeMode: 'contain' },
  botaoFecharModal: { position: 'absolute', top: espacamento.m, right: espacamento.m, zIndex: 1, padding: 4 },
  modalAuth: { paddingHorizontal: espacamento.xl, paddingBottom: espacamento.xl, width: '90%', maxWidth: 400 },
  itemUsuario: { backgroundColor: cores.fundoEscuro, padding: espacamento.l, borderRadius: bordas.raioPequeno, marginBottom: espacamento.m, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nomeUsuario: { fontFamily: tipografia.familia, color: cores.textoClaro, fontSize: tipografia.tamanhos.corpo },
  roleUsuario: { fontFamily: tipografia.familia, color: cores.primaria, fontSize: tipografia.tamanhos.label, textTransform: 'capitalize' }
});