import AsyncStorage from '@react-native-async-storage/async-storage';

export type Usuario = {
  username: string;
  password: string;
  role: 'funcionario' | 'medico';
};

const CHAVE_STORAGE = 'usuarios';

/**
 * Busca todos os usuários cadastrados.
 */
export async function buscarUsuarios(): Promise<Usuario[]> {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_STORAGE);
    return dados ? JSON.parse(dados) : [];
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    return [];
  }
}

/**
 * Salva um novo usuário.
 */
export async function salvarNovoUsuario(novoUsuario: Usuario): Promise<{ sucesso: boolean, mensagem: string }> {
  if (!novoUsuario.username.trim() || !novoUsuario.password.trim()) {
    return { sucesso: false, mensagem: 'Nome de usuário e senha são obrigatórios.' };
  }
  
  try {
    const usuariosAtuais = await buscarUsuarios();
    const usuarioExistente = usuariosAtuais.find(
      (u) => u.username.toLowerCase() === novoUsuario.username.toLowerCase()
    );

    if (usuarioExistente) {
      return { sucesso: false, mensagem: 'Este nome de usuário já está em uso.' };
    }

    usuariosAtuais.push(novoUsuario);
    await AsyncStorage.setItem(CHAVE_STORAGE, JSON.stringify(usuariosAtuais));
    
    return { sucesso: true, mensagem: 'Usuário cadastrado com sucesso!' };

  } catch (err) {
    console.error("Erro ao salvar usuário:", err);
    return { sucesso: false, mensagem: 'Ocorreu um erro ao salvar o usuário.' };
  }
}

/**
 * Atualiza os dados de um usuário.
 */
export async function atualizarUsuario(usernameOriginal: string, dadosAtualizados: Usuario): Promise<{sucesso: boolean, mensagem: string}> {
    if (!dadosAtualizados.username.trim() || !dadosAtualizados.password.trim()) {
      return { sucesso: false, mensagem: 'Nome de usuário e senha não podem ficar em branco.' };
    }
    try {
        const usuariosAtuais = await buscarUsuarios();
        
        const conflitoDeNome = usuariosAtuais.find(
            u => u.username.toLowerCase() === dadosAtualizados.username.toLowerCase() && u.username.toLowerCase() !== usernameOriginal.toLowerCase()
        );

        if (conflitoDeNome) {
            return { sucesso: false, mensagem: "O novo nome de usuário já está em uso por outro usuário." };
        }

        const novaLista = usuariosAtuais.map(u => {
            if (u.username.toLowerCase() === usernameOriginal.toLowerCase()) {
                return dadosAtualizados;
            }
            return u;
        });

        await AsyncStorage.setItem(CHAVE_STORAGE, JSON.stringify(novaLista));
        return { sucesso: true, mensagem: "Usuário atualizado com sucesso!" };

    } catch (e) {
        console.error("Erro ao atualizar usuário:", e)
        return { sucesso: false, mensagem: "Ocorreu um erro ao atualizar o usuário." };
    }
}

export async function deletarUsuario(usernameParaDeletar: string): Promise<{sucesso: boolean, mensagem: string}> {
    try {
        const usuariosAtuais = await buscarUsuarios();
        const tamanhoOriginal = usuariosAtuais.length;

        const novaLista = usuariosAtuais.filter(
            u => u.username.toLowerCase() !== usernameParaDeletar.toLowerCase()
        );

        // Se o tamanho da lista não mudou, o usuário não foi encontrado.
        if (novaLista.length === tamanhoOriginal) {
            console.error("Tentativa de deletar um usuário não encontrado:", usernameParaDeletar);
            return { sucesso: false, mensagem: "Usuário não encontrado para deleção." };
        }

        await AsyncStorage.setItem('usuarios', JSON.stringify(novaLista));
        return { sucesso: true, mensagem: "Usuário deletado com sucesso!" };

    } catch (e) {
        console.error("Erro ao deletar usuário:", e);
        return { sucesso: false, mensagem: "Ocorreu um erro ao deletar o usuário." };
    }
}