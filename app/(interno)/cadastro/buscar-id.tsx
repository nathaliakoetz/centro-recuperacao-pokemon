// Tela melhorada de busca por ID do treinador com visual de Pokémon
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, FlatList, TouchableOpacity, ImageBackground, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { estilosGlobais } from "../../../styles/estilosGlobais";

export default function BuscarID() {
  const [idTreinador, setIdTreinador] = useState("");
  const [pokemons, setPokemons] = useState<any[]>([]);

  const buscarCadastro = async () => {
    if (!idTreinador.trim()) {
      Alert.alert("Atenção", "Digite o ID do treinador.");
      return;
    }
    try {
      const dados = await AsyncStorage.getItem(`pokemons:${idTreinador}`);
      if (dados) {
        const lista = JSON.parse(dados);
        setPokemons(lista);
      } else {
        Alert.alert("Não encontrado", "Nenhum Pokémon cadastrado com esse ID.");
        setPokemons([]);
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
          <Text style={[estilosGlobais.titulo, { fontSize: 14, marginBottom: 20 }]}>Buscar Pokémon por ID do Treinador</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite o ID do treinador"
            value={idTreinador}
            onChangeText={setIdTreinador}
          />

          <TouchableOpacity style={estilosGlobais.botaoBase} onPress={buscarCadastro}>
            <Text style={estilosGlobais.textoBotao}>Buscar</Text>
          </TouchableOpacity>

          {pokemons.length > 0 && (
            <FlatList
              data={pokemons}
              keyExtractor={(_, i) => i.toString()}
              style={{ marginTop: 20 }}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.nome}>{item.nomePokemon}</Text>
                  <Image source={{ uri: item.imagem || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png" }} style={styles.img} />
                  <Text style={styles.tipo}>Tipo: {item.tipoPokemon}</Text>
                  <Text style={styles.texto}>Espécie: {item.especiePokemon}</Text>
                  <Text style={styles.texto}>Data de captura: {item.dataCaptura}</Text>
                  <Text style={styles.texto}>Treinador: {item.nomeTreinador || "-"}</Text>
                  <Text style={styles.texto}>ID: {item.idTreinador}</Text>
                  {item.descricao ? <Text style={styles.texto}>"{item.descricao}"</Text> : null}
                </View>
              )}
            />
          )}
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
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    width: 300,
    alignSelf: "center",
  },
  img: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  nome: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
  },
  tipo: {
    color: "#e63946",
    fontWeight: "bold",
  },
  texto: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
});