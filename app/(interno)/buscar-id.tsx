import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { estilosGlobais } from "../../styles/estilosGlobais";

export default function BuscarID() {
  const [idTreinador, setIdTreinador] = useState("");

  const buscarCadastro = async () => {
    try {
      const dados = await AsyncStorage.getItem(`pokemons:${idTreinador}`);
      if (dados) {
        const pokemons = JSON.parse(dados);
        Alert.alert("Encontrado!", `Total de Pokémon(s): ${pokemons.length}`);

      } else {
        Alert.alert("Não encontrado", "Nenhum Pokémon cadastrado com esse ID.");
      }
    } catch (err) {
      Alert.alert("Erro", "Falha ao buscar os dados.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/fundo.jpg")}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    >
      <View style={estilosGlobais.fundoComOverlay}>
        <View style={estilosGlobais.containerCentralizado}>
          <Text style={[estilosGlobais.titulo, { fontSize: 14, marginBottom: 20 }]}>
            Buscar Pokémon por ID do Treinador
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o ID do treinador"
            value={idTreinador}
            onChangeText={setIdTreinador}
          />
          <Button title="Buscar" onPress={buscarCadastro} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: 250,
  },
});