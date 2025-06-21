import { View, Text, Image, StyleSheet } from 'react-native';
import { cores, espacamento, bordas, tipografia } from '../styles/estilosGlobais';
import { PokemonCadastro } from '../utils/salvarPokemon';

interface PokemonInfoCardProps {
  pokemon: PokemonCadastro;
}

export default function PokemonInfoCard({ pokemon }: PokemonInfoCardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: pokemon.imagem || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png' }}
        style={styles.imagem}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.nome}>{pokemon.nomePokemon}</Text>
        <Text style={styles.detalhe}>Espécie: {pokemon.especiePokemon}</Text>
        <Text style={styles.detalhe}>Tipo: {pokemon.tipoPokemon}</Text>
        <Text style={styles.detalhe}>Treinador: {pokemon.nomeTreinador} ({pokemon.idTreinador})</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.fundoSuperficie,
    borderRadius: bordas.raioMedio,
    padding: espacamento.l,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: espacamento.l,
    width: '100%',
  },
  imagem: {
    width: 80,
    height: 80,
    borderRadius: bordas.raioPequeno,
    marginRight: espacamento.l,
    backgroundColor: '#fff',
  },
  infoContainer: {
    flex: 1,
  },
  nome: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.subtitulo,
    color: cores.primaria,
    fontWeight: tipografia.pesos.bold,
    marginBottom: espacamento.s,
  },
  detalhe: {
    fontFamily: tipografia.familia,
    fontSize: tipografia.tamanhos.label,
    color: cores.textoClaro,
    lineHeight: 20,
  },
});