import { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, ImageBackground, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import TelaCarregamento from "../components/TelaCarregamento";
import { estilosGlobais } from "../styles/estilosGlobais";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(true);
  let [fontesCarregadas] = useFonts({ PressStart2P_400Regular });

  useEffect(() => {
    const timeout = setTimeout(() => setCarregando(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (carregando || !fontesCarregadas) return <TelaCarregamento />;

  const realizarLogin = () => {
    if (usuario === "admin" && senha === "1234") {
      router.push({
        pathname: "/(interno)",
        params: { usuario },
      });
    } else {
      Alert.alert("Erro", "Usuário ou senha inválidos");
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

          <Text style={styles.loginButton} onPress={realizarLogin}>
            Entrar
          </Text>
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