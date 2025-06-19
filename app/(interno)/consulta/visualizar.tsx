import { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { estilosGlobais } from "../../../styles/estilosGlobais";
import { useRouter, useFocusEffect } from "expo-router";
import { PokemonCadastro } from "../../../utils/salvarPokemon"; 
import { cores } from "../../../styles/estilosGlobais"; // Importando as cores

export default function VisualizarConsulta() {
  const [pokemonsConsulta, setPokemonsConsulta] = useState<PokemonCadastro[]>([]);
  const router = useRouter();

  const buscarConsulta = async () => {
    try {
      const todasChaves = await AsyncStorage.getAllKeys();
      const chavesPokemons = todasChaves.filter((k) => k.startsWith("pokemons:"));
      const registros = await AsyncStorage.multiGet(chavesPokemons);

      const todosPokemons: PokemonCadastro[] = registros.flatMap(([, val]) => {
        try {
          const lista = JSON.parse(val || "[]");
          return Array.isArray(lista) ? lista : [];
        } catch {
          return [];
        }
      });

      const pokemonsEmConsulta = todosPokemons.filter(p => p.emConsulta === true);
      setPokemonsConsulta(pokemonsEmConsulta);
    } catch (err) {
      console.error("Erro ao buscar Pokémons em consulta:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarConsulta();
    }, [])
  );

  return (
    <ImageBackground source={require("../../../assets/fundo.jpg")} style={estilosGlobais.fundoComOverlay} resizeMode="cover">
      <View style={estilosGlobais.topBar}>
        <TouchableOpacity onPress={() => router.push("/(interno)/medico/medico")}>
          <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      <Text style={[estilosGlobais.titulo, { marginVertical: 20 }]}>Pokémons em Consulta</Text>

      {pokemonsConsulta.length === 0 ? (
        <View style={styles.semConsultaContainer}>
          <Image source={require("../../../assets/snorlax.png")} style={styles.snorlax} />
          <Text style={styles.nenhumTexto}>NENHUM POKÉMON ESTÁ EM ATENDIMENTO NO MOMENTO.</Text>
        </View>
      ) : (
        <FlatList
          data={pokemonsConsulta}
          keyExtractor={(item) => item.idTreinador || item.nomePokemon + item.nomeTreinador}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imagem }} style={styles.img} />
              <View style={{ flex: 1 }}>
                <Text style={styles.nome}>{item.nomePokemon}</Text>
                <Text style={styles.texto}>Treinador: <Text style={{ fontStyle: "italic" }}>{item.nomeTreinador}</Text></Text>
                <Text style={styles.texto}>Descrição: {item.descricao}</Text>
              </View>
            </View>
          )}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  img: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  nome: {
    fontWeight: "bold",
    fontSize: 14,
    color: cores.vermelho, // Cor padrão
    fontFamily: "Roboto", // Tipografia Roboto
  },
  texto: {
    color: cores.textoClaro, // Cor padrão de texto
    fontSize: 12,
    fontFamily: "Roboto", // Tipografia Roboto
    marginTop: 2,
  },
  nenhumTexto: {
    color: "#fff",
    fontSize: 150,
    textAlign: "center",
    marginTop: 20,
  },
  semConsultaContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 20,
  },
  snorlax: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: "contain",
  },
});