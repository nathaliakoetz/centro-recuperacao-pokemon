import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Image, Dimensions, } from "react-native";
import { router } from "expo-router";
import { estilosGlobais, cores, tipografia, espacamento, bordas, sombras, } from "../styles/estilosGlobais";
import BotaoAcao from "../components/BotaoAcao";

export default function LoginMedico() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [codigoGerado, setCodigoGerado] = useState("");
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [segundaEtapa, setSegundaEtapa] = useState(false);
  const [modalCodigoVisivel, setModalCodigoVisivel] = useState(false);
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

  const gerarCodigo = () => {
    const codigo = Math.floor(1000 + Math.random() * 9000).toString();
    setCodigoGerado(codigo);
    setSegundaEtapa(true);
    setModalCodigoVisivel(true);
  };

  const verificarCredenciais = () => {
    if (usuario === "medico" && senha === "1234") {
      gerarCodigo();
    } else {
      setMensagemErro("Usuário ou senha inválidos.");
      setModalErroVisivel(true);
    }
  };

  const verificarCodigo = () => {
    if (!codigoDigitado.trim()) {
      setMensagemErro("Digite o código recebido.");
      setModalErroVisivel(true);
      return;
    }
    if (parseInt(codigoDigitado) === parseInt(codigoGerado)) {
      router.push({ pathname: "/(interno)/medico/medico", params: { usuario } });
    } else {
      setMensagemErro("Código de verificação incorreto.");
      setModalErroVisivel(true);
    }
  };

  const eTelaLarga = larguraTela >= 768;

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <View style={[styles.loginContainer, { flexDirection: eTelaLarga ? 'row' : 'column' }]}>
        <View style={styles.colunaEsquerda}>
          
          <View style={styles.tituloContainer}>
            <Text style={styles.tituloPrincipal}>CENTRO DE</Text>
            <Text style={styles.tituloPrincipal}>RECUPERAÇÃO</Text>
            <Text style={styles.subtituloPokemon}>Pokémon</Text>
          </View>

          {!segundaEtapa ? (
            <>
              <TextInput
                style={estilosGlobais.campoTexto}
                placeholder="Usuário"
                placeholderTextColor={cores.textoSecundario}
                value={usuario}
                onChangeText={setUsuario}
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
            </>
          ) : (
            <>
              <Text style={estilosGlobais.label}>Digite o código recebido:</Text>
              <TextInput
                style={estilosGlobais.campoTexto}
                placeholder="0000"
                placeholderTextColor={cores.textoSecundario}
                keyboardType="numeric"
                value={codigoDigitado}
                onChangeText={setCodigoDigitado}
              />
              <BotaoAcao onPress={verificarCodigo}>
                Verificar Código
              </BotaoAcao>
            </>
          )}
        </View>

        <View style={styles.colunaDireita}>
          <Image
            source={require('../assets/chansey.png')}
            style={styles.imagemChansey}
          />
        </View>
      </View>

      <Modal transparent visible={modalCodigoVisivel} animationType="fade">
        <View style={estilosGlobais.modalFundo}>
          <View style={estilosGlobais.modalConteudo}>
            <Text style={estilosGlobais.modalTitulo}>Código de Verificação</Text>
            <Text style={styles.modalCodigo}>{codigoGerado}</Text>
            <TouchableOpacity onPress={() => setModalCodigoVisivel(false)}>
              <Text style={styles.modalFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalErroVisivel} animationType="fade">
        <View style={estilosGlobais.modalFundo}>
          <View style={estilosGlobais.modalConteudo}>
            <Text style={estilosGlobais.modalTitulo}>Atenção</Text>
            <Text style={estilosGlobais.modalTexto}>{mensagemErro}</Text>
            <TouchableOpacity onPress={() => setModalErroVisivel(false)}>
              <Text style={styles.modalFechar}>Fechar</Text>
            </TouchableOpacity>
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
    height: 400,
    resizeMode: 'contain',
  },
  tituloContainer: {
    marginBottom: espacamento.xxl,
  },
  tituloPrincipal: {
    fontFamily: tipografia.familia,
    fontSize: 42,
    lineHeight: 45,
    color: cores.textoClaro,
  },
  subtituloPokemon: {
    fontFamily: tipografia.familia,
    fontSize: 42,
    lineHeight: 45,
    color: cores.primaria,
  },
  modalCodigo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo + 10,
    fontWeight: tipografia.pesos.bold,
    color: cores.primaria,
    marginVertical: 10,
  },
  modalFechar: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoSecundario,
    marginTop: 10,
    textDecorationLine: "underline",
  },
});