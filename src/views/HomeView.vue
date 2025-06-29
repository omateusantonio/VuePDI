<template>
	<div class="">
		<DataTable
			:value="listaDeChamados"
			paginator
			:rows="15"
			:rowsPerPageOptions="[5, 10, 20, 50]"
			tableStyle="min-width: 50rem"
		>
			<Column field="nomeUsuario" header="Solicitante" style="width: 25%"></Column>
			<Column field="usuario" header="Nome de usuário" style="width: 25%"></Column>
			<Column field="dataPedido" header="Data da solicitação" style="width: 25%"></Column>
			<Column field="categoria" header="Categoria do chamado" style="width: 25%"></Column>
		</DataTable>
	</div>
</template>

<script setup>
	import DataTable from "primevue/datatable"
	import Column from "primevue/column"
	import chamadoService from "@/common/services/chamadoService"
	import { ref, onMounted } from "vue"

	const listaDeChamados = ref([])

	onMounted(() => {
		_obterTodosOsChamados()
	})

	const _obterTodosOsChamados = () => {
		chamadoService
			.obterTodos()
			.then((dados) => {
				_adicionarCategoriaAosChamados(dados)
				_formatarDataChamados(dados)
				listaDeChamados.value = dados
			})
			.catch((erro) => console.error("Erro ao obter chamados:", erro))
	}

	const _obterCategoriasDeChamado = () => {
		return {
			1: "Infra",
			2: "SAP",
			3: "SalesForce",
			4: "Desenvolvimento",
			5: "Outros"
		}
	}

	const _adicionarCategoriaAosChamados = (chamados) => {
        const categorias = _obterCategoriasDeChamado()
        chamados.forEach((chamado) => {
        	const categoriaId = Math.floor(Math.random() * 5) + 1
			chamado.categoria = categorias[categoriaId]
        })
    }

	const _formatarDataChamados = (chamados) => {
		chamados.forEach((chamado) => {
			const data = new Date(chamado.dataPedido)
			chamado.dataPedido = data.toLocaleDateString("pt-BR", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit"
			})
		})
	}
</script>
