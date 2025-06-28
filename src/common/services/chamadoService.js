import apiService from "@/common/api.js"

const urlBase = "https://686036b8c55df67558a07105.mockapi.io/v1/chamados"

const chamadoService = {
	async obterTodos() {
		try {
			return await apiService.get(urlBase)
		} catch (erro) {
			console.error("Erro ao obter todos os chamados:", erro)
			throw erro
		}
	},

	async obterPorId(id) {
		try {
			return await apiService.get(`${urlBase}/${id}`)
		} catch (erro) {
			console.error(`Erro ao obter chamado com ID ${id}:`, erro)
			throw erro
		}
	},

	async criar(chamado) {
		try {
			return await apiService.post(urlBase, chamado)
		} catch (erro) {
			console.error("Erro ao criar chamado:", erro)
			throw erro
		}
	},

	async atualizar(id, chamado) {
		try {
			return await apiService.put(`${urlBase}/${id}`, chamado)
		} catch (erro) {
			console.error(`Erro ao atualizar chamado com ID ${id}:`, erro)
			throw erro
		}
	},

	async excluir(id) {
		try {
			return await apiService.delete(`${urlBase}/${id}`)
		} catch (erro) {
			console.error(`Erro ao excluir chamado com ID ${id}:`, erro)
			throw erro
		}
	}
}

export default chamadoService
