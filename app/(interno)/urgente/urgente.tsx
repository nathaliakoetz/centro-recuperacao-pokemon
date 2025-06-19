import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { estilosGlobais } from "../../../styles/estilosGlobais";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import TelaCarregamento from "../../../components/TelaCarregamento";
import { salvarPokemon } from "../../../utils/salvarPokemon";
import { buscarDadosPorEspecie } from "../../../utils/pokeapi";
import * as Animatable from "react-native-animatable";

export default function CadastroUrgente() {
  const router = useRouter();
  const [especiePokemon, setEspeciePokemon] = useState("");
  const [tipoPokemon, setTipoPokemon] = useState("");
  const [imagemPokemon, setImagemPokemon] = useState("");
  const [nomeTreinador, setNomeTreinador] = useState("");
  const [descricao, setDescricao] = useState("");
  const [modalVisivel, setModalVisivel] = useState(false);

  const [fontesCarregadas] = useFonts({ PressStart2P_400Regular });
  if (!fontesCarregadas) return <TelaCarregamento />;

  const buscarEspecie = async () => {
    if (!especiePokemon.trim()) return;
    const dados = await buscarDadosPorEspecie(especiePokemon);
    if (dados) {
      setTipoPokemon(dados.tipos.join(", "));
      setImagemPokemon(dados.urlImagem);
    }
  };

  const salvar = async () => {
    if (!especiePokemon || !tipoPokemon || !nomeTreinador || !descricao) return;

    const resultado = await salvarPokemon({
      nomePokemon: especiePokemon,
      tipoPokemon,
      especiePokemon,
      dataCaptura: "",
      foiTroca: false,
      nomeTreinador,
      idTreinador: "urgente",
      descricao,
      imagem: imagemPokemon,
      urgente: true,
    });

    if (resultado.sucesso) {
      setEspeciePokemon("");
      setTipoPokemon("");
      setImagemPokemon("");
      setNomeTreinador("");
      setDescricao("");
      setModalVisivel(true);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/fundo.jpg")}
      style={estilosGlobais.fundoComOverlay}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[estilosGlobais.topBar, { marginTop: 40 }]}> 
          <TouchableOpacity onPress={() => router.push("/(interno)/tela-inicial")}> 
            <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={[estilosGlobais.titulo, { marginVertical: 30 }]}>Cadastro Urgente</Text>

          <View style={styles.inputGroup}>
            <Text style={estilosGlobais.label}>Espécie do Pokémon *</Text>
            <TextInput
              style={estilosGlobais.campoTexto}
              value={especiePokemon}
              onChangeText={setEspeciePokemon}
              onBlur={buscarEspecie}
              placeholder="Ex: Pikachu"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={estilosGlobais.label}>Tipo</Text>
            <TextInput style={estilosGlobais.campoTexto} value={tipoPokemon} editable={false} />
          </View>

          {imagemPokemon && (
            <View style={[estilosGlobais.caixaImagem, styles.inputGroup]}>
              <Image source={{ uri: imagemPokemon }} style={estilosGlobais.imagemPokemon} />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={estilosGlobais.label}>Nome do Treinador *</Text>
            <TextInput
              style={estilosGlobais.campoTexto}
              value={nomeTreinador}
              onChangeText={setNomeTreinador}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={estilosGlobais.label}>Descrição *</Text>
            <TextInput
              style={estilosGlobais.campoMultilinha}
              multiline
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>

          <TouchableOpacity style={[estilosGlobais.botaoBase, styles.inputGroup]} onPress={salvar}>
            <Text style={estilosGlobais.textoBotao}>Salvar Cadastro</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de sucesso */}
        <Modal transparent visible={modalVisivel} animationType="fade">
          <View style={styles.modalFundo}>
            <Animatable.View
              animation="bounceIn"
              duration={1000}
              style={styles.modalConteudo}
            >
              <Text style={styles.modalTexto}>Pokémon cadastrado com sucesso!</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)} style={styles.modalBotao}>
                <Text style={styles.modalBotaoTexto}>Fechar</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  formContainer: {
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalConteudo: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    width: "70%",
    borderWidth: 3,
    borderColor: "#e63946",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  modalTexto: {
    fontSize: 14,
    color: "#e63946",
    fontFamily: "PressStart2P_400Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  modalBotao: {
    backgroundColor: "#e63946",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalBotaoTexto: {
    color: "#fff",
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
  },
});