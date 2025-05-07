import AsyncStorage from "@react-native-async-storage/async-storage";

export type PokemonCadastro = {
  nomePokemon: string;
  tipoPokemon: string;
  especiePokemon: string;
  dataCaptura: string;
  foiTroca: boolean;
  nomeTreinador: string;
  idTreinador: string;
  descricao: string;
};

export async function salvarPokemon(pokemon: PokemonCadastro): Promise<{ sucesso: boolean }> {
  try {
    if (!pokemon.idTreinador) throw new Error("ID do treinador inválido.");

    const chave = `pokemons:${pokemon.idTreinador}`;
    const dadosAnteriores = await AsyncStorage.getItem(chave);
    const pokemons: PokemonCadastro[] = dadosAnteriores ? JSON.parse(dadosAnteriores) : [];

    pokemons.push(pokemon);
    await AsyncStorage.setItem(chave, JSON.stringify(pokemons));

    return { sucesso: true };
  } catch (err) {
    console.error("Erro ao salvar Pokémon:", err);
    return { sucesso: false };
  }
}
