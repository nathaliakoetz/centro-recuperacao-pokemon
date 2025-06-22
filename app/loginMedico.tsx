import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Image, Dimensions, } from "react-native";
import { useAuth } from "../context/AuthContext";
import { estilosGlobais, cores, tipografia, espacamento, bordas, sombras, } from "../styles/estilosGlobais";
import BotaoAcao from "../components/BotaoAcao";
import Feather from "@expo/vector-icons/build/Feather";

export default function LoginMedico() {
  const { login } = useAuth();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [modalErroVisivel, setModalErroVisivel] = useState(false);
  const [larguraTela, setLarguraTela] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const aoMudar = () => {
      setLarguraTela(Dimensions.get('window').width);
    };
    const subscription = Dimensions.addEventListener('change', aoMudar);
    return () => subscription?.remove();
  }, []);

  const verificarCredenciais = () => {
    if (usuario === "medico" && senha === "1234") {
      login(usuario);
    } else {
      setMensagemErro("Usuário ou senha inválidos.");
      setModalErroVisivel(true);
    }
  };

  const eTelaLarga = larguraTela >= 768;

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={[styles.loginContainer, { flexDirection: eTelaLarga ? 'row' : 'column' }]}>
        <View style={styles.colunaEsquerda}>

          <View style={styles.tituloContainer}>
            <Text style={styles.tituloPrincipal}>ÁREA DO</Text>
            <Text style={styles.subtituloPokemon}>Médico</Text>
          </View>

          <TextInput
            style={estilosGlobais.campoTexto}
            placeholder="Usuário"
            placeholderTextColor={cores.textoSecundario}
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
          />
          <TextInput
            style={estilosGlobais.campoTexto}
            placeholder="Senha"
            placeholderTextColor={cores.textoSecundario}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
          <BotaoAcao onPress={verificarCredenciais}>
            Entrar
          </BotaoAcao>

        </View>

        <View style={styles.colunaDireita}>
          <Image
            source={require('../assets/chansey.png')}
            style={styles.imagemChansey}
          />
        </View>
      </View>

      <Modal transparent visible={modalErroVisivel} animationType="fade">
        <View style={estilosGlobais.modalFundo}>
          <View style={estilosGlobais.modalConteudo}>
            <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setModalErroVisivel(false)}>
              <Feather name="x" size={24} color={cores.textoSecundario} />
            </TouchableOpacity>
            <Text style={estilosGlobais.modalTitulo}>Atenção</Text>
            <Text style={estilosGlobais.modalTexto}>{mensagemErro}</Text>
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
});