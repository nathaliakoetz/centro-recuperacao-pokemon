import {View, Text, TextInput, ImageBackground, Switch, ScrollView, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { estilosGlobais } from "../../../styles/estilosGlobais";
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import TelaCarregamento from "../../../components/TelaCarregamento";
import { salvarPokemon } from "../../../utils/salvarPokemon";
import { buscarDadosPorEspecie, DadosPokemon } from "../../../utils/pokeapi";
import axios from "axios";

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
  const [listaSugestoes, setListaSugestoes] = useState<any[]>([]);
  const [todasEspecies, setTodasEspecies] = useState<any[]>([]);
  const [fontesCarregadas] = useFonts({ PressStart2P_400Regular });

  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=2000")
      .then(res => setTodasEspecies(res.data.results))
      .catch(() => setTodasEspecies([]));
  }, []);

  const buscarEspecie = async (nome: string) => {
    setEspeciePokemon(nome);
    if (nome.length < 3) {
      setListaSugestoes([]);
      return;
    }
    const filtradas = todasEspecies.filter(p => p.name.includes(nome.toLowerCase())).slice(0, 10);
    setListaSugestoes(filtradas);
  };

  const selecionarEspecie = async (nome: string) => {
    setListaSugestoes([]);
    const dados: DadosPokemon | null = await buscarDadosPorEspecie(nome);
    if (dados) {
      setEspeciePokemon(dados.nomeEspecie);
      setTipoPokemon(dados.tipos.join(", "));
      setImagemPokemon(dados.urlImagem);
    }
  };

  const formatarData = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    let formatado = apenasNumeros;
    if (apenasNumeros.length >= 3 && apenasNumeros.length <= 4)
      formatado = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
    else if (apenasNumeros.length > 4)
      formatado = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`;
    setDataCaptura(formatado);
  };

  const salvar = async () => {
    const nomeFinal = usarNomePersonalizado ? nomePersonalizado : especiePokemon;

    if (!nomeFinal || !tipoPokemon || !especiePokemon || !idTreinador || !dataCaptura) {
      alert("Preencha todos os campos obrigatórios corretamente.");
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
      alert("Pokémon cadastrado com sucesso!");
      setNomePersonalizado("");
      setTipoPokemon("");
      setEspeciePokemon("");
      setImagemPokemon("");
      setDataCaptura("");
      setListaSugestoes([]);
      setFoiTroca(false);
      setNomeTreinador("");
      setIdTreinador("");
      setDescricao("");
      setUsarNomePersonalizado(false);
    } else {
      alert("Erro ao salvar cadastro.");
    }
  };

  if (!fontesCarregadas) return <TelaCarregamento />;

  return (
    <ImageBackground source={require("../../assets/fundo.jpg")} style={estilosGlobais.fundoComOverlay} resizeMode="cover">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={estilosGlobais.topBar}>
          <TouchableOpacity onPress={() => router.push("/(interno)")}>
            <Text style={estilosGlobais.linkTopo}>← Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/login")}> 
            <Text style={estilosGlobais.linkTopo}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={[estilosGlobais.titulo, { marginTop: 40, marginBottom: 30 }]}>Cadastrar PokePaciente</Text>

        <Text style={estilosGlobais.label}>Espécie do Pokémon *</Text>
        <TextInput
          style={estilosGlobais.campoTexto}
          value={especiePokemon}
          onChangeText={buscarEspecie}
          placeholder="Digite o nome"
        />

        {listaSugestoes.length > 0 && (
          <FlatList
            data={listaSugestoes}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selecionarEspecie(item.name)} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <Image source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.url.split("/")[6]}.png` }} style={{ width: 40, height: 40, marginRight: 10 }} />
                <Text style={{ color: "#fff" }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <Text style={estilosGlobais.label}>Possui nome personalizado?</Text>
        <Switch value={usarNomePersonalizado} onValueChange={setUsarNomePersonalizado} />

        {usarNomePersonalizado && (
          <>
            <Text style={estilosGlobais.label}>Nome do Pokémon *</Text>
            <TextInput
              style={estilosGlobais.campoTexto}
              value={nomePersonalizado}
              onChangeText={setNomePersonalizado}
              placeholder="Ex: Sol, Tyr"
            />
          </>
        )}

        <Text style={estilosGlobais.label}>Tipo(s)</Text>
        <TextInput style={estilosGlobais.campoTexto} value={tipoPokemon} editable={false} />

        {imagemPokemon && (
          <View style={estilosGlobais.caixaImagem}>
            <Image source={{ uri: imagemPokemon }} style={estilosGlobais.imagemPokemon} />
          </View>
        )}

        <Text style={estilosGlobais.label}>Data de Captura *</Text>
        <TextInput
          style={estilosGlobais.campoTexto}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
          value={dataCaptura}
          onChangeText={formatarData}
          maxLength={10}
        />

        <Text style={estilosGlobais.label}>Adquirido por troca?</Text>
        <Switch value={foiTroca} onValueChange={setFoiTroca} />

        <Text style={estilosGlobais.label}>Nome do Treinador</Text>
        <TextInput style={estilosGlobais.campoTexto} value={nomeTreinador} onChangeText={setNomeTreinador} />

        <Text style={estilosGlobais.label}>ID do Treinador *</Text>
        <TextInput style={estilosGlobais.campoTexto} value={idTreinador} onChangeText={setIdTreinador} />

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
      </ScrollView>
    </ImageBackground>
  );
}