import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { estilosGlobais, cores, tipografia, espacamento, bordas, sombras } from "../styles/estilosGlobais";
import BotaoAcao from "../components/BotaoAcao";
import { buscarUsuarios, Usuario } from "../utils/gerenciarUsuarios";
import Feather from "@expo/vector-icons/build/Feather";

export default function LoginMedico() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [larguraTela, setLarguraTela] = useState(Dimensions.get('window').width);
  const [mensagemErro, setMensagemErro] = useState("");
  const [modalErroVisivel, setModalErroVisivel] = useState(false);

  const [codigoModalVisivel, setCodigoModalVisivel] = useState(false);
  const [codigoFalso, setCodigoFalso] = useState('');
  const [usuarioParaVerificar, setUsuarioParaVerificar] = useState<Usuario | null>(null);

  useEffect(() => {
    const aoMudar = () => setLarguraTela(Dimensions.get('window').width);
    const subscription = Dimensions.addEventListener('change', aoMudar);
    return () => subscription?.remove();
  }, []);

  const verificarCredenciais = async () => {
    if (!usuario.trim() || !senha.trim()) {
      setMensagemErro("Usuário e senha são obrigatórios.");
      setModalErroVisivel(true);
      return;
    }

    const usuariosCadastrados = await buscarUsuarios();
    const usuarioEncontrado = usuariosCadastrados.find(
      u => u.username.toLowerCase() === usuario.toLowerCase() && u.role === 'medico'
    );

    if (usuarioEncontrado && usuarioEncontrado.password === senha) {
      const codigoGerado = "123456";
      setCodigoFalso(codigoGerado);
      setUsuarioParaVerificar(usuarioEncontrado);
      setCodigoModalVisivel(true);
    } else {
      setMensagemErro("Usuário ou senha inválidos para a Área Médica.");
      setModalErroVisivel(true);
    }
  };

  const prosseguirParaVerificacao = () => {
    setCodigoModalVisivel(false);
    if (usuarioParaVerificar) {
      router.push({
        pathname: '/verificar-codigo',
        params: {
          codigoCorreto: codigoFalso,
          usuario: JSON.stringify(usuarioParaVerificar)
        }
      });
    }
  };

  const eTelaLarga = larguraTela >= 768;

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={[styles.loginContainer, { flexDirection: eTelaLarga ? 'row' : 'column' }]}>
        <View style={styles.colunaEsquerda}>
          <TouchableOpacity style={styles.voltarContainer} onPress={() => router.back()}>
            <Image source={require('../assets/voltar.png')} style={styles.voltarIcon} />
          </TouchableOpacity>
          <View style={styles.tituloContainer}>
            <Text style={styles.tituloPrincipal}>ÁREA DO</Text>
            <Text style={styles.subtituloPokemon}>Médico</Text>
          </View>
          <TextInput style={estilosGlobais.campoTexto} placeholder="Usuário" value={usuario} onChangeText={setUsuario} autoCapitalize="none" />
          <TextInput style={estilosGlobais.campoTexto} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
          <BotaoAcao onPress={verificarCredenciais}>Entrar</BotaoAcao>
        </View>
        <View style={styles.colunaDireita}>
          <Image source={require('../assets/chansey.png')} style={styles.imagemChansey} />
        </View>
      </View>

      <Modal transparent visible={modalErroVisivel} animationType="fade" onRequestClose={() => setModalErroVisivel(false)}>
      </Modal>

      <Modal transparent visible={codigoModalVisivel} animationType="fade" onRequestClose={prosseguirParaVerificacao}>
        <View style={estilosGlobais.modalFundo}>
          <View style={[estilosGlobais.modalConteudo, { padding: espacamento.xl }]}>
            <Text style={estilosGlobais.modalTitulo}>Código de Verificação</Text>
            <Text style={estilosGlobais.modalTexto}>Para simular o login, use o código abaixo na próxima tela:</Text>
            <View style={styles.codigoContainer}>
              <Text style={styles.codigoTexto}>{codigoFalso}</Text>
            </View>
            <BotaoAcao onPress={prosseguirParaVerificacao}>Prosseguir</BotaoAcao>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  loginContainer: {
    width: '100%',
    maxWidth: 900,
    padding: espacamento.xl,
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioGrande,
    ...sombras.sombraMedia,
  },
  colunaEsquerda: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: espacamento.xl,
  },
  colunaDireita: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagemChansey: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  tituloContainer: {
    marginBottom: espacamento.xxl,
  },
  tituloPrincipal: {
    fontFamily: tipografia.familia,
    fontSize: 48,
    lineHeight: 52,
    color: cores.textoClaro,
  },
  subtituloPokemon: {
    fontFamily: tipografia.familia,
    fontSize: 48,
    lineHeight: 52,
    color: cores.primaria,
  },
  botaoFecharModal: {
    position: 'absolute',
    top: espacamento.m,
    right: espacamento.m,
    zIndex: 1,
    padding: espacamento.s,
  },
  codigoContainer: {
    backgroundColor: cores.fundoEscuro,
    paddingVertical: espacamento.m,
    paddingHorizontal: espacamento.xl,
    borderRadius: bordas.raioPequeno,
    marginBottom: espacamento.xl,
    alignItems: 'center',
  },
  codigoTexto: {
    fontFamily: tipografia.familia,
    fontSize: 32,
    color: cores.primaria,
    letterSpacing: 8,
  },
  voltarContainer: {
    marginBottom: espacamento.l,
    alignSelf: 'flex-start'
  },
  voltarIcon: {
    width: 30,
    height: 30,
    tintColor: cores.textoSecundario
  },
});