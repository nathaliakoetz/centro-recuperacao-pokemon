import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { cores } from "../styles/estilosGlobais"; // Importando as cores
import { estilosGlobais } from "../styles/estilosGlobais"; // Importando estilos globais

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
    if (usuario === "medico" && senha === "1234") { // Login de médico
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
      router.push({ pathname: "/(interno)/medico/medico", params: { usuario } }); // Redirecionando para a tela do médico
    } else {
      setMensagemErro("Código de verificação incorreto");
      setModalErroVisivel(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={estilosGlobais.fundoComOverlay}>
        <View style={estilosGlobais.containerCentralizado}>
          <Text style={estilosGlobais.titulo}>Login do Médico</Text>

          {!segundaEtapa && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Usuário"
                placeholderTextColor={cores.cinzaClaro}
                value={usuario}
                onChangeText={setUsuario}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={cores.cinzaClaro}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
              <Text style={styles.loginButton} onPress={verificarCredenciais}>
                Próximo
              </Text>
            </>
          )}

          {segundaEtapa && (
            <>
              <Text style={estilosGlobais.label}>Digite o código recebido</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1234"
                placeholderTextColor={cores.cinzaClaro}
                keyboardType="numeric"
                value={codigoDigitado}
                onChangeText={setCodigoDigitado}
              />
              <Text style={styles.loginButton} onPress={verificarCodigo}>
                Verificar
              </Text>
            </>
          )}
        </View>

        {/* Modal de Código */}
        <Modal transparent visible={modalCodigoVisivel} animationType="fade">
          <View style={styles.modalFundo}>
            <View style={styles.modalErroCaixa}>
              <Text style={styles.modalErroTexto}>Código de Verificação</Text>
              <Text style={styles.modalCodigo}>{codigoGerado}</Text>
              <TouchableOpacity onPress={() => setModalCodigoVisivel(false)}>
                <Text style={styles.modalErroFechar}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de Erro */}
        <Modal transparent visible={modalErroVisivel} animationType="fade">
          <View style={styles.modalFundo}>
            <View style={styles.modalErroCaixa}>
              <Text style={styles.modalErroTexto}>{mensagemErro}</Text>
              <TouchableOpacity onPress={() => setModalErroVisivel(false)}>
                <Text style={styles.modalErroFechar}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundoEscuro, // Fundo escuro para manter o padrão
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    backgroundColor: cores.branco,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    color: cores.azulEscuro,
    borderWidth: 1,
    borderColor: cores.cinzaClaro,
  },
  loginButton: {
    backgroundColor: cores.vermelho, // Usando a cor de destaque vermelha
    color: cores.branco,
    textAlign: "center",
    paddingVertical: 14,
    borderRadius: 12,
    fontWeight: "bold",
    fontSize: 16,
    width: "100%",
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalErroCaixa: {
    backgroundColor: cores.branco,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: 300,
  },
  modalErroTexto: {
    fontFamily: "Roboto",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  modalErroFechar: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: cores.vermelho,
    textAlign: "center",
  },
  modalCodigo: {
    fontSize: 24,
    color: cores.vermelho,
    fontFamily: "Roboto",
    marginBottom: 10,
    textAlign: "center",
  },
});