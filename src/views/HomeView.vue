<template>
	<div class="">
		<div class="flex justify-start mb-4">
			<Button label="Novo" @click="abrirDialogNovo" />
			<Button label="Remover selecionados" severity="danger" class="ml-2" />
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
			<Column field="nomeUsuario" header="Solicitante" style="width: 20%"></Column>
			<Column field="usuario" header="Nome de usuário" style="width: 20%"></Column>
			<Column field="dataPedido" header="Data da solicitação" style="width: 20%"></Column>
			<Column field="categoria" header="Categoria" style="width: 20%"></Column>
			<Column field="descricao" header="Descrição" style="width: 20%">
				<template #body="slotProps">
					{{ slotProps.data.descricao.substring(0, 50)
					}}{{ slotProps.data.descricao.length > 50 ? "..." : "" }}
				</template>
			</Column>
		</DataTable>

		<ChamadoDialog
			v-model:visivel="dialogVisivel"
			:chamado="chamadoParaEditar"
			:categorias="categoriasParaSelect"
			@salvar="salvarChamado"
			@update:visivel="dialogVisivel = $event"
		/>
	</div>
</template>

<script setup>
	import DataTable from "primevue/datatable"
	import Column from "primevue/column"
	import Button from "primevue/button"
	import ChamadoDialog from "@/components/ChamadoDialog.vue"
	import chamadoService from "@/common/services/chamadoService"
	import { ref, onMounted, watch, computed } from "vue"

	const listaDeChamados = ref([])
	const chamadoSelecionado = ref(null)
	const dialogVisivel = ref(false)
	const chamadoParaEditar = ref({})

	const categoriasParaSelect = computed(() => {
		const categorias = _obterCategoriasDeChamado()
		return Object.keys(categorias).map((key) => ({
			label: categorias[key],
			value: categorias[key]
		}))
	})

	watch(chamadoSelecionado, (novoValor) => {
		if (novoValor) {
			chamadoParaEditar.value = { ...novoValor }
			dialogVisivel.value = true
		}
	})

	watch(dialogVisivel, (novoValor) => {
		if (!novoValor) {
			chamadoSelecionado.value = null
		}
	})

	onMounted(() => {
		_obterTodosOsChamados()
	})

	const _obterTodosOsChamados = () => {
		chamadoService
			.obterTodos()
			.then((dados) => {
				_adicionarIdAosChamados(dados)
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

	const _adicionarIdAosChamados = (chamados) => {
		chamados.forEach((chamado, index) => {
			chamado.id = index + 1
		})
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

	const abrirDialogNovo = () => {
		chamadoParaEditar.value = {}
		dialogVisivel.value = true
	}

	const salvarChamado = (chamadoEditado) => {
		const index = listaDeChamados.value.findIndex((c) => c.id === chamadoEditado.id)

		if (index > -1) {
			listaDeChamados.value[index] = chamadoEditado
		} else {
			chamadoEditado.id = listaDeChamados.value.length + 1
			chamadoEditado.dataPedido = new Date().toLocaleDateString("pt-BR", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit"
			})
			listaDeChamados.value.push(chamadoEditado)
		}

		dialogVisivel.value = false
		chamadoSelecionado.value = null
	}
</script>
