import { StyleSheet } from "react-native";

export const cores = {
  fundoEscuro: "#1e1e1e", // Fundo escuro mais neutro
  azulEscuro: "#2c3e50", // Azul escuro
  branco: "#fff",
  textoClaro: "#ecf0f1", // Texto claro
  cinzaClaro: "#bdc3c7", // Cinza claro para textos secundários
  vermelho: "#e63946", // Vermelho para destacar botões e interações
  verdeClaro: "#2a9d8f", // Cor de destaque verde claro
};

export const estilosGlobais = StyleSheet.create({
  // Containers básicos
  containerCentralizado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: cores.fundoEscuro,
  },
  containerCentralPadding: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  fundoComOverlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: cores.fundoEscuro,
  },

  // Textos
  titulo: {
    fontFamily: "Roboto",
    fontSize: 28,
    color: cores.branco,
    textAlign: "center",
    marginBottom: 20,
  },
  textoSecundario: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: cores.textoClaro,
    marginBottom: 6,
  },
  textoNormal: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: cores.textoClaro,
    marginBottom: 6,
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: cores.textoClaro,
    marginBottom: 6,
  },
  linkTopo: {
    color: cores.branco,
    fontFamily: "Roboto",
    fontSize: 14,
    textDecorationLine: "underline", // Adicionando um efeito visual no link
  },

  // Inputs
  campoTexto: {
    backgroundColor: cores.branco,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: cores.azulEscuro,
    borderWidth: 1,
    borderColor: cores.cinzaClaro,
    marginBottom: 15,
  },
  campoMultilinha: {
    backgroundColor: cores.branco,
    borderRadius: 10,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
    fontSize: 14,
    color: cores.azulEscuro,
    borderWidth: 1,
    borderColor: cores.cinzaClaro,
    marginBottom: 15,
  },

  // Botões
  botaoBase: {
    backgroundColor: cores.vermelho,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5, // Efeito de sombra
  },
  botaoSecundario: {
    backgroundColor: cores.verdeClaro,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5, // Efeito de sombra
  },
  textoBotao: {
    color: cores.branco,
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Imagem quadrada para visualização do Pokémon
  caixaImagem: {
    width: 180,
    height: 180,
    borderWidth: 2,
    borderColor: cores.cinzaClaro,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 20,
    alignSelf: "center",
  },
  imagemPokemon: {
    width: 140,
    height: 140,
    borderRadius: 12, // Bordas arredondadas para as imagens
  },

  // Voltar e logout
  scroll: {
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: cores.azulEscuro, // Cor de fundo mais sóbria para a barra
    paddingVertical: 10,
    borderRadius: 8, // Barras mais arredondadas
  },
  voltarTexto: {
    color: cores.branco,
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "600",
  },

  // Modal Padrão
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalConteudo: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  modalTitulo: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: cores.vermelho,
    marginBottom: 12,
  },
  modalTexto: {
    fontSize: 12,
    fontFamily: "Roboto",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  modalBotaoFechar: {
    backgroundColor: cores.verdeClaro,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
  },
  textoFecharModal: {
    color: cores.branco,
    fontFamily: "Roboto",
    fontSize: 14,
    textAlign: "center",
  },
});