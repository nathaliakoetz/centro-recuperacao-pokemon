import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  Switch,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { estilosGlobais } from "../../styles/estilosGlobais";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import TelaCarregamento from "../../components/TelaCarregamento";
import ComponenteTipoPokemon from "../../components/ComponenteTipoPokemon";
import ComponenteEspeciePokemon from "../../components/ComponenteEspeciePokemon";
import { salvarPokemon } from "../(interno)/salvarPokemon";

const imagensEspecies: Record<string, any> = {
  Pikachu: require("../../assets/pokemons/pikachu.png"),
  Charmander: require("../../assets/pokemons/charmander.png"),
  Bulbasaur: require("../../assets/pokemons/bulbasaur.png"),
};

export default function Cadastro() {
  const [nomePokemon, setNomePokemon] = useState("");
  const [tipoPokemon, setTipoPokemon] = useState("");
  const [especiePokemon, setEspeciePokemon] = useState("");
  const [dataCaptura, setDataCaptura] = useState("");
  const [foiTroca, setFoiTroca] = useState(false);
  const [nomeTreinador, setNomeTreinador] = useState("");
  const [idTreinador, setIdTreinador] = useState("");
  const [descricao, setDescricao] = useState("");

  const [fontesCarregadas] = useFonts({ PressStart2P_400Regular });
  if (!fontesCarregadas) return <TelaCarregamento />;

  const handleEspecieChange = (novaEspecie: string) => {
    setEspeciePokemon(novaEspecie);
    if (novaEspecie === "Pikachu") setTipoPokemon("Elétrico");
    if (novaEspecie === "Charmander") setTipoPokemon("Fogo");
    if (novaEspecie === "Bulbasaur") setTipoPokemon("Planta");
  };

  const handleSalvar = async () => {
    if (!nomePokemon || !tipoPokemon || !especiePokemon || !idTreinador) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    const resultado = await salvarPokemon({
      nomePokemon,
      tipoPokemon,
      especiePokemon,
      dataCaptura,
      foiTroca,
      nomeTreinador,
      idTreinador,
      descricao,
    });

    if (resultado.sucesso) {
      Alert.alert("Sucesso", "Pokémon cadastrado com sucesso!");
      setNomePokemon("");
      setTipoPokemon("");
      setEspeciePokemon("");
      setDataCaptura("");
      setFoiTroca(false);
      setNomeTreinador("");
      setIdTreinador("");
      setDescricao("");
    } else {
      Alert.alert("Erro", "Não foi possível salvar o cadastro.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/fundo.jpg")}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[estilosGlobais.titulo, { marginBottom: 30 }]}>Cadastrar PokePaciente</Text>

        <View style={styles.container}>
          <View style={styles.coluna}>
            <Text style={styles.label}>Nome do Pokémon *</Text>
            <TextInput
              style={styles.input}
              value={nomePokemon}
              onChangeText={setNomePokemon}
            />

            <Text style={styles.label}>Tipo do Pokémon *</Text>
            <ComponenteTipoPokemon selectedTipo={tipoPokemon} onTipoChange={setTipoPokemon} />

            <Text style={styles.label}>Espécie do Pokémon *</Text>
            <ComponenteEspeciePokemon
              selectedEspecie={especiePokemon}
              onEspecieChange={handleEspecieChange}
            />

            <View style={styles.imagemBox}>
              {especiePokemon && imagensEspecies[especiePokemon] ? (
                <Image
                  source={imagensEspecies[especiePokemon]}
                  style={styles.pokemonImagem}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.textoImagem}>Imagem do Pokémon</Text>
              )}
            </View>
          </View>

          <View style={styles.coluna}>
            <Text style={styles.label}>Data de Captura</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={dataCaptura}
              onChangeText={setDataCaptura}
            />

            <Text style={styles.label}>Adquirido por troca?</Text>
            <Switch value={foiTroca} onValueChange={setFoiTroca} />

            <Text style={styles.label}>Nome do Treinador</Text>
            <TextInput
              style={styles.input}
              value={nomeTreinador}
              onChangeText={setNomeTreinador}
            />

            <Text style={styles.label}>ID do Treinador *</Text>
            <TextInput
              style={styles.input}
              value={idTreinador}
              onChangeText={setIdTreinador}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.inputMultiline}
              multiline
              numberOfLines={4}
              value={descricao}
              onChangeText={setDescricao}
            />

            <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
              <Text style={styles.textoBotao}>Salvar Cadastro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 24,
  },
  coluna: {
    flexGrow: 1,
    flexBasis: "45%",
    maxWidth: 400,
    minWidth: 280,
    gap: 12,
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
  },
  inputMultiline: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    color: "#fff",
    marginBottom: 4,
  },
  imagemBox: {
    width: 160,
    height: 160,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 20,
    alignSelf: "center",
  },
  pokemonImagem: {
    width: 120,
    height: 120,
  },
  textoImagem: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 8,
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  botao: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 20,
    alignItems: "center",
  },
  textoBotao: {
    color: "#e63946",
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
  },
});