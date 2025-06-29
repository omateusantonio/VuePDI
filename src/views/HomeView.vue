<template>
	<div class="">
		<div class="flex justify-start mb-4">
			<Button
				label="Novo" />
			<Button
				label="Remover selecionados"
				severity="danger"
				class="ml-2" />
		</div>
		<DataTable
			selectionMode="single"
			v-model:selection="chamadoSelecionado"
			dataKey="id"
			:value="listaDeChamados"
			:rows="15"
			:rowsPerPageOptions="[5, 10, 20, 50]"
			tableStyle="min-width: 50rem"
			paginator
		>
			<Column
				field="nomeUsuario"
				header="Solicitante"
				style="width: 20%"></Column>
			<Column
				field="usuario"
				header="Nome de usuário"
				style="width: 20%"></Column>
			<Column
				field="dataPedido"
				header="Data da solicitação"
				style="width: 20%"></Column>
			<Column
				field="categoria"
				header="Categoria"
				style="width: 20%"></Column>
			<Column
                field="descricao"
                header="Descrição"
                style="width: 20%">
                <template #body="slotProps">
                    {{ slotProps.data.descricao.substring(0, 50) }}{{ slotProps.data.descricao.length > 50 ? "..." : "" }}
                </template>
            </Column>
		</DataTable>
	</div>
</template>

<script setup>
	import DataTable from "primevue/datatable"
	import Column from "primevue/column"
	import Button from "primevue/button"
	import chamadoService from "@/common/services/chamadoService"
	import { ref, onMounted } from "vue"

	const listaDeChamados = ref([])
	const chamadoSelecionado = ref(null)

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
