import axios from "axios";

export interface DadosPokemon {
  id: number;
  nomeEspecie: string;
  tipos: string[];
  urlImagem: string;
  fraquezas: string[]; // Adicionamos 'fraquezas' à interface
}

export async function buscarDadosPorEspecie(especie: string): Promise<DadosPokemon | null> {
  try {
    const respostaPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${especie.toLowerCase()}`);
    const respostaEspecie = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${especie.toLowerCase()}`);

    const tiposTraduzidosPromises = respostaPokemon.data.types.map(async (tipoItem: any) => {
      const urlTipo = tipoItem.type.url;
      const respostaTipo = await axios.get(urlTipo);
      const nomePT = respostaTipo.data.names.find((n: any) => n.language.name === "pt");
      return {
        nome: nomePT ? nomePT.name : tipoItem.type.name,
        damageRelationsUrl: urlTipo // Mantemos a URL para buscar relações de dano
      };
    });

    const tiposComUrls = await Promise.all(tiposTraduzidosPromises);
    const tiposNomes = tiposComUrls.map(t => t.nome);

    let todasFraquezas: Set<string> = new Set();

    for (const tipoInfo of tiposComUrls) {
      const respostaTipoDetalhes = await axios.get(tipoInfo.damageRelationsUrl);
      const damageRelations = respostaTipoDetalhes.data.damage_relations;

      // Fraquezas (double_damage_from)
      for (const fraquezaRelation of damageRelations.double_damage_from) {
        const resFraqueza = await axios.get(fraquezaRelation.url);
        const nomeFraquezaPT = resFraqueza.data.names.find((n: any) => n.language.name === "pt");
        if (nomeFraquezaPT) {
          todasFraquezas.add(nomeFraquezaPT.name);
        } else {
          todasFraquezas.add(fraquezaRelation.name);
        }
      }
    }

    const nomePT = respostaEspecie.data.names.find((n: any) => n.language.name === "pt");

    return {
      id: respostaPokemon.data.id,
      nomeEspecie: nomePT ? nomePT.name : especie,
      tipos: tiposNomes,
      urlImagem: respostaPokemon.data.sprites.front_default,
      fraquezas: Array.from(todasFraquezas) // Converte o Set para Array
    };
  } catch (erro) {
    console.error("Erro ao buscar dados da PokéAPI:", erro);
    return null;
  }
}