import { StyleSheet } from "react-native";

export const cores = {
  fundoEscuro: "rgba(0,0,0,0.5)",
  vermelho: "#e63946",
  branco: "#fff",
  texto: "#f1faee",
};

export const estilosGlobais = StyleSheet.create({
  // Containers básicos
  containerCentralizado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  containerCentralPadding: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 350,
  },
  fundoComOverlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: cores.fundoEscuro,
  },

  // Textos
  titulo: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 28,
    color: cores.branco,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    color: cores.branco,
    marginBottom: 4,
  },
  textoCaixaImagem: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 8,
    color: cores.branco,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  linkTopo: {
    color: cores.branco,
    fontFamily: "PressStart2P_400Regular",
    fontSize: 8,
  },

  // Inputs
  campoTexto: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    padding: 10,
  },
  campoMultilinha: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
  },

  // Botões
  botaoBase: {
    backgroundColor: cores.branco,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotao: {
    color: cores.vermelho,
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Imagem quadrada para visualização do Pokémon
  caixaImagem: {
    width: 160,
    height: 160,
    borderWidth: 2,
    borderColor: cores.branco,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 20,
    alignSelf: "center",
  },
  imagemPokemon: {
    width: 120,
    height: 120,
  },

  // voltar e logout
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
});