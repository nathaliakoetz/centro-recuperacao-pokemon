import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { estilosGlobais, cores, espacamento, bordas, sombras, tipografia } from '../../../styles/estilosGlobais';
import BotaoAcao from '../../../components/BotaoAcao';
import PokemonInfoCard from '../../../components/PokemonInfoCard';
import { PokemonCadastro } from '../../../utils/salvarPokemon';

export default function BuscarID() {
  const router = useRouter();
  const [idTreinador, setIdTreinador] = useState("");
  const [pokemons, setPokemons] = useState<PokemonCadastro[]>([]);
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  const buscarCadastro = async () => {
    if (!idTreinador.trim()) {
      Alert.alert("Atenção", "Digite o ID do treinador.");
      return;
    }
    try {
      const dados = await AsyncStorage.getItem(`pokemons:${idTreinador}`);
      setPokemons(dados ? JSON.parse(dados) : []);
    } catch (err) {
      Alert.alert("Erro", "Falha ao buscar os dados.");
      setPokemons([]);
    } finally {
      setBuscaRealizada(true);
    }
  };

  return (
    <View style={estilosGlobais.containerCentralizado}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardPrincipal}>
          <TouchableOpacity style={styles.voltarContainer} onPress={() => router.back()}>
            <Image source={require('../../../assets/voltar.png')} style={styles.voltarIcon} />
          </TouchableOpacity>

          <Image source={require('../../../assets/id.png')} style={styles.imagemPrincipal} />

          <Text style={styles.titulo}>Buscar por ID do Treinador</Text>
          
          <View style={styles.formContainer}>
            <TextInput
              style={styles.campoBusca}
              placeholder="Digite o ID do treinador..."
              placeholderTextColor={cores.textoSecundario}
              value={idTreinador}
              onChangeText={setIdTreinador}
            />
            <BotaoAcao onPress={buscarCadastro} style={styles.botaoBusca}>
              Buscar
            </BotaoAcao>
          </View>
        </View>
        
        {buscaRealizada && pokemons.length === 0 && (
          <Text style={styles.textoResultado}>Não há treinadores com esse ID.</Text>
        )}

        <FlatList
          style={styles.listaResultados}
          data={pokemons}
          keyExtractor={(item, index) => item.nomePokemon + index}
          renderItem={({ item }) => <PokemonInfoCard pokemon={item} />}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
    maxWidth: 700,
    alignItems: 'center',
    padding: espacamento.l,
  },
  cardPrincipal: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioGrande,
    padding: espacamento.xl,
    alignItems: 'center',
    width: '100%',
    ...sombras.sombraMedia,
    marginBottom: espacamento.xl,
  },
  voltarContainer: {
    alignSelf: 'flex-start',
    position: 'absolute',
    top: espacamento.l,
    left: espacamento.l,
  },
  voltarIcon: {
    width: 30,
    height: 30,
    tintColor: cores.textoSecundario,
  },
  imagemPrincipal: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: espacamento.l,
  },
  titulo: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.titulo,
    color: cores.textoClaro,
    textAlign: 'center',
    marginBottom: espacamento.l,
  },
  formContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: espacamento.m,
  },
  campoBusca: {
    ...estilosGlobais.campoTexto,
    flex: 1,
    marginBottom: 0,
  },
  botaoBusca: {
    paddingHorizontal: espacamento.l,
  },
  listaResultados: {
    width: '100%',
  },
  textoResultado: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.corpo,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginVertical: espacamento.xl,
  },
});