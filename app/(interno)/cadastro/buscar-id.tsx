import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { estilosGlobais } from "../../../styles/estilosGlobais";
import { cores } from "../../../styles/estilosGlobais"; // Importando as cores
import { router } from "expo-router";

export default function BuscarID() {
  const [idTreinador, setIdTreinador] = useState("");
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [treinadores, setTreinadores] = useState<any[]>([]); // Estado para armazenar treinadores cadastrados

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

  const selecionarTreinador = async () => {
    try {
      // Carregar treinadores já cadastrados (simulação com AsyncStorage)
      const dadosTreinadores = await AsyncStorage.getItem("treinadores");
      if (dadosTreinadores) {
        setTreinadores(JSON.parse(dadosTreinadores));
      } else {
        Alert.alert("Nenhum treinador encontrado", "Não há treinadores cadastrados.");
      }
    } catch (err) {
      Alert.alert("Erro", "Falha ao carregar treinadores.");
    }
  };

  return (
    <View style={estilos.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={estilosGlobais.topBar}>
          <TouchableOpacity onPress={() => router.push("/(interno)/cadastro/cadastro-check")}>
            <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={estilosGlobais.linkTopo}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={estilosGlobais.containerCentralizado}>
          <Text style={[estilosGlobais.titulo, { fontSize: 14, marginBottom: 20 }]}>
            Buscar Pokémon por ID do Treinador
          </Text>

          <View style={estilos.inputContainer}>
            <TextInput
              style={estilos.input}
              placeholder="Digite o ID do treinador"
              value={idTreinador}
              onChangeText={setIdTreinador}
            />
            <TouchableOpacity style={estilos.botaoSelecionar} onPress={selecionarTreinador}>
              <Text style={estilos.botaoTexto}>Selecionar Treinador</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={estilosGlobais.botaoBase} onPress={buscarCadastro}>
            <Text style={estilosGlobais.textoBotao}>Buscar</Text>
          </TouchableOpacity>

          {pokemons.length > 0 && (
            <FlatList
              data={pokemons}
              keyExtractor={(_, i) => i.toString()}
              style={{ marginTop: 20 }}
              renderItem={({ item }) => (
                <View style={estilos.card}>
                  <Text style={estilos.nome}>{item.nomePokemon}</Text>
                  <Image
                    source={{
                      uri:
                        item.imagem ||
                        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png",
                    }}
                    style={estilos.img}
                  />
                  <Text style={estilos.tipo}>Tipo: {item.tipoPokemon}</Text>
                  <Text style={estilos.texto}>Espécie: {item.especiePokemon}</Text>
                  <Text style={estilos.texto}>Data de captura: {item.dataCaptura}</Text>
                  <Text style={estilos.texto}>Treinador: {item.nomeTreinador || "-"}</Text>
                  <Text style={estilos.texto}>ID Treinador: {item.idTreinador}</Text>
                </View>
              )}
            />
          )}

          {treinadores.length > 0 && (
            <View style={estilos.treinadoresContainer}>
              <Text style={estilos.subtitulo}>Treinadores Cadastrados:</Text>
              {treinadores.map((treinador, index) => (
                <Text key={index} style={estilos.texto}>{treinador.nome}</Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundoEscuro, // Fundo escuro para manter o padrão
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: cores.branco,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    width: 200,
  },
  botaoSelecionar: {
    backgroundColor: cores.azulEscuro,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  botaoTexto: {
    color: cores.branco,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
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
    color: cores.vermelho,
    fontWeight: "bold",
  },
  texto: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  treinadoresContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  subtitulo: {
    color: cores.branco,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
});