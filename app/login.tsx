import { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, ImageBackground, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import TelaCarregamento from "../components/TelaCarregamento";
import { estilosGlobais } from "../styles/estilosGlobais";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [codigoGerado, setCodigoGerado] = useState("");
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [segundaEtapa, setSegundaEtapa] = useState(false);
  const [carregando, setCarregando] = useState(true);

  let [fontesCarregadas] = useFonts({ PressStart2P_400Regular });

  useEffect(() => {
    const timeout = setTimeout(() => setCarregando(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (carregando || !fontesCarregadas) return <TelaCarregamento />;

  const gerarCodigo = () => {
    const codigo = Math.floor(1000 + Math.random() * 9000).toString(); // Ex: 4 dígitos
    setCodigoGerado(codigo);
    setSegundaEtapa(true);
    Alert.alert("Código de verificação", `Seu código é: ${codigo}`);
  };

  const verificarCredenciais = () => {
    if (usuario === "admin" && senha === "1234") {
      gerarCodigo();
    } else {
      Alert.alert("Erro", "Usuário ou senha inválidos");
    }
  };

  const verificarCodigo = () => {
    if (codigoDigitado === codigoGerado) {
      router.push({ pathname: "/(interno)", params: { usuario } });
    } else {
      Alert.alert("Erro", "Código de verificação incorreto");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/fundo.jpg")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <View style={estilosGlobais.fundoComOverlay}>
        <View style={estilosGlobais.containerCentralizado}>
          <Text style={estilosGlobais.titulo}>Login do Funcionário</Text>

          {!segundaEtapa && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Usuário"
                placeholderTextColor="#999"
                value={usuario}
                onChangeText={setUsuario}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
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
                placeholderTextColor="#999"
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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 12,
    fontFamily: "PressStart2P_400Regular",
  },
  loginButton: {
    backgroundColor: "#fff",
    color: "#e63946",
    textAlign: "center",
    paddingVertical: 12,
    borderRadius: 10,
    fontWeight: "bold",
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
  },
});
