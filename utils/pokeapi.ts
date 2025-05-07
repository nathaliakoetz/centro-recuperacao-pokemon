// utils/pokeapi.ts
import axios from "axios";

export interface DadosPokemon {
  id: number;
  nomeEspecie: string;
  tipos: string[];
  urlImagem: string;
}

/**
 * Busca dados completos de um Pokémon a partir do nome da espécie.
 * Inclui nome em português, tipos em português e imagem oficial.
 */
export async function buscarDadosPorEspecie(especie: string): Promise<DadosPokemon | null> {
  try {
    // Requisições principais
    const respostaPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${especie.toLowerCase()}`);
    const respostaEspecie = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${especie.toLowerCase()}`);

    // Traduz tipos para PT-BR
    const tiposTraduzidos = await Promise.all(
      respostaPokemon.data.types.map(async (tipoItem: any) => {
        const urlTipo = tipoItem.type.url;
        const respostaTipo = await axios.get(urlTipo);
        const nomePT = respostaTipo.data.names.find((n: any) => n.language.name === "pt");
        return nomePT ? nomePT.name : tipoItem.type.name;
      })
    );

    // Traduz nome da espécie para PT-BR
    const nomePT = respostaEspecie.data.names.find((n: any) => n.language.name === "pt");

    return {
      id: respostaPokemon.data.id,
      nomeEspecie: nomePT ? nomePT.name : especie,
      tipos: tiposTraduzidos,
      urlImagem: respostaPokemon.data.sprites.front_default,
    };
  } catch (erro) {
    console.error("Erro ao buscar dados da PokéAPI:", erro);
    return null;
  }
}
