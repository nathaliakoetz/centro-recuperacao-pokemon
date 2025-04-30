import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username !== "admin" || password !== "1234") {
      Alert.alert("Erro", "Usuário ou senha inválidos");
    }
    // A navegação será feita com o Link abaixo (não é automática aqui)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login do Funcionário</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Link
        href="/(interno)"
        asChild
        onPress={(e) => {
          if (username !== "admin" || password !== "1234") {
            e.preventDefault(); // impede a navegação
            Alert.alert("Erro", "Usuário ou senha inválidos");
          }
        }}
      >
        <Text style={styles.loginButton}>Entrar</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#2A9D8F",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 12,
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
});
