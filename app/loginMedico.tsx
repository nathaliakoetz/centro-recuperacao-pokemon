import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { estilosGlobais, cores, tipografia } from "../styles/estilosGlobais";
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
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setCarregando(false), 1000);
    return () => clearTimeout(timeout);
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
      setMensagemErro("Usuário ou senha inválidos");
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
      setMensagemErro("Código de verificação incorreto");
      setModalErroVisivel(true);
    }
  };

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <Text style={estilosGlobais.titulo}>Login do Médico</Text>
      
      <View style={styles.formContainer}>
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
              Próximo
            </BotaoAcao>
          </>
        ) : (
          <>
            <Text style={estilosGlobais.label}>Digite o código recebido</Text>
            <TextInput
              style={estilosGlobais.campoTexto}
              placeholder="Ex: 1234"
              placeholderTextColor={cores.textoSecundario}
              keyboardType="numeric"
              value={codigoDigitado}
              onChangeText={setCodigoDigitado}
            />
            <BotaoAcao onPress={verificarCodigo}>
              Verificar
            </BotaoAcao>
          </>
        )}
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

// estilos locais
const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalCodigo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo,
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