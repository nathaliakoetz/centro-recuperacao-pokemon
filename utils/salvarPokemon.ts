import AsyncStorage from "@react-native-async-storage/async-storage";

export type EntradaHistorico = {
  data: string;
  descricao: string;
};

export type PokemonCadastro = {
  nomePokemon: string;
  tipoPokemon: string;
  especiePokemon: string;
  dataCaptura: string;
  foiTroca: boolean;
  nomeTreinador: string;
  idTreinador: string;
  descricao: string;
  imagem?: string;
  urgente?: boolean;
  internado?: boolean;
  emConsulta?: boolean;
  historico?: EntradaHistorico[];
  finalizado?: boolean;
};

export async function salvarPokemon(pokemon: PokemonCadastro): Promise<{ sucesso: boolean }> {
  try {
    if (!pokemon.idTreinador) throw new Error("ID do treinador inválido.");

    // Salva na lista geral
    const chave = `pokemons:${pokemon.idTreinador}`;
    const dadosAnteriores = await AsyncStorage.getItem(chave);
    const pokemons: PokemonCadastro[] = dadosAnteriores ? JSON.parse(dadosAnteriores) : [];
    pokemons.push(pokemon);
    await AsyncStorage.setItem(chave, JSON.stringify(pokemons));

    // Se for em consulta direta
    if (pokemon.emConsulta) {
      await AsyncStorage.setItem(`consultando:${pokemon.idTreinador}`, JSON.stringify(pokemon));
    }

    // Se for internado direto
    if (pokemon.internado) {
      await AsyncStorage.setItem(`internados:${pokemon.idTreinador}`, JSON.stringify(pokemon));
    }

    // Salvar histórico inicial
    const entradaHistorico: EntradaHistorico = {
      data: new Date().toLocaleString(),
      descricao: pokemon.descricao || "Sem descrição inicial",
    };

    await AsyncStorage.setItem(
      `historico:${pokemon.idTreinador}`,
      JSON.stringify([entradaHistorico])
    );

    return { sucesso: true };
  } catch (err) {
    console.error("Erro ao salvar Pokémon:", err);
    return { sucesso: false };
  }
}