import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Switch,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { estilosGlobais } from "../../styles/estilosGlobais";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import TelaCarregamento from "../../components/TelaCarregamento";
import { salvarPokemon } from "../../utils/salvarPokemon";
import { buscarDadosPorEspecie, DadosPokemon } from "../../utils/pokeapi";

export default function Cadastro() {
  const router = useRouter();

  const [usarNomePersonalizado, setUsarNomePersonalizado] = useState(false);
  const [nomePersonalizado, setNomePersonalizado] = useState("");
  const [especiePokemon, setEspeciePokemon] = useState("");
  const [tipoPokemon, setTipoPokemon] = useState("");
  const [imagemPokemon, setImagemPokemon] = useState("");
  const [dataCaptura, setDataCaptura] = useState("");
  const [foiTroca, setFoiTroca] = useState(false);
  const [nomeTreinador, setNomeTreinador] = useState("");
  const [idTreinador, setIdTreinador] = useState("");
  const [descricao, setDescricao] = useState("");

  const [fontesCarregadas] = useFonts({ PressStart2P_400Regular });
  if (!fontesCarregadas) return <TelaCarregamento />;

  const buscarEspecie = async () => {
    if (!especiePokemon) {
      Alert.alert("Aviso", "Digite a espécie do Pokémon");
      return;
    }

    const dados: DadosPokemon | null = await buscarDadosPorEspecie(especiePokemon);
    if (dados) {
      setEspeciePokemon(dados.nomeEspecie);
      setTipoPokemon(dados.tipos.join(", "));
      setImagemPokemon(dados.urlImagem);
    } else {
      Alert.alert("Erro", "Espécie não encontrada.");
    }
  };

  const salvar = async () => {
    const nomeFinal = usarNomePersonalizado ? nomePersonalizado : especiePokemon;

    if (!nomeFinal || !tipoPokemon || !especiePokemon || !idTreinador) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    const resultado = await salvarPokemon({
      nomePokemon: nomeFinal,
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
      setNomePersonalizado("");
      setTipoPokemon("");
      setEspeciePokemon("");
      setImagemPokemon("");
      setDataCaptura("");
      setFoiTroca(false);
      setNomeTreinador("");
      setIdTreinador("");
      setDescricao("");
      setUsarNomePersonalizado(false);
    } else {
      Alert.alert("Erro", "Não foi possível salvar o cadastro.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/fundo.jpg")}
      style={estilosGlobais.fundoComOverlay}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.push("/(interno)")}>
            <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={estilosGlobais.linkTopo}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={[estilosGlobais.titulo, { marginTop: 40, marginBottom: 30 }]}>
          Cadastrar PokePaciente
        </Text>

        <View style={styles.container}>
          <View style={styles.coluna}>
            <Text style={estilosGlobais.label}>Espécie do Pokémon *</Text>
            <TextInput
              style={estilosGlobais.campoTexto}
              value={especiePokemon}
              onChangeText={setEspeciePokemon}
              placeholder="Ex: Pikachu"
            />

            <TouchableOpacity onPress={buscarEspecie} style={estilosGlobais.botaoBase}>
              <Text style={estilosGlobais.textoBotao}>Buscar Espécie</Text>
            </TouchableOpacity>

            <Text style={estilosGlobais.label}>Deseja dar um nome personalizado?</Text>
            <Switch value={usarNomePersonalizado} onValueChange={setUsarNomePersonalizado} />

            {usarNomePersonalizado && (
              <>
                <Text style={estilosGlobais.label}>Nome do Pokémon *</Text>
                <TextInput
                  style={estilosGlobais.campoTexto}
                  value={nomePersonalizado}
                  onChangeText={setNomePersonalizado}
                  placeholder="Ex: Tyr, Sol..."
                />
              </>
            )}

            <Text style={estilosGlobais.label}>Tipo(s)</Text>
            <TextInput
              style={estilosGlobais.campoTexto}
              value={tipoPokemon}
              editable={false}
            />

            <View style={estilosGlobais.caixaImagem}>
              {imagemPokemon ? (
                <Image source={{ uri: imagemPokemon }} style={estilosGlobais.imagemPokemon} />
              ) : (
                <Text style={estilosGlobais.textoCaixaImagem}>Imagem do Pokémon</Text>
              )}
            </View>
          </View>

          <View style={styles.coluna}>
            <Text style={estilosGlobais.label}>Data de Captura</Text>
            <TextInput
              style={estilosGlobais.campoTexto}
              placeholder="DD/MM/AAAA"
              value={dataCaptura}
              onChangeText={setDataCaptura}
            />

            <Text style={estilosGlobais.label}>Adquirido por troca?</Text>
            <Switch value={foiTroca} onValueChange={setFoiTroca} />

            <Text style={estilosGlobais.label}>Nome do Treinador</Text>
            <TextInput
              style={estilosGlobais.campoTexto}
              value={nomeTreinador}
              onChangeText={setNomeTreinador}
            />

            <Text style={estilosGlobais.label}>ID do Treinador *</Text>
            <TextInput
              style={estilosGlobais.campoTexto}
              value={idTreinador}
              onChangeText={setIdTreinador}
            />

            <Text style={estilosGlobais.label}>Descrição</Text>
            <TextInput
              style={estilosGlobais.campoMultilinha}
              multiline
              numberOfLines={4}
              value={descricao}
              onChangeText={setDescricao}
            />

            <TouchableOpacity style={estilosGlobais.botaoBase} onPress={salvar}>
              <Text style={estilosGlobais.textoBotao}>Salvar Cadastro</Text>
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 24,
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },
  coluna: {
    flexGrow: 1,
    flexBasis: "45%",
    maxWidth: 400,
    minWidth: 280,
    gap: 12,
    paddingHorizontal: 10,
  },
});